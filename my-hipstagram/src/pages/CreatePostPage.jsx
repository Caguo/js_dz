import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Button, TextField, Typography, CircularProgress, AppBar, Toolbar, Avatar, IconButton, Snackbar, Alert, Modal
} from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useCreatePostMutation } from '../redux/postsApiSlice'; // Замените на правильный путь к вашему хуку создания поста
import SearchBar from '../components/SearchBar';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';
import { actionAboutMe } from '../redux/actions';
import { useDropzone } from 'react-dropzone';
import useFileUpload from '../hooks/useFileUpload'; // Убедитесь, что путь корректен

const BASE_URL = 'http://hipstagram.node.ed.asmer.org.ua'; // Ваш базовый URL

const CreatePostPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [images, setImages] = useState([]); // Хранит объекты изображений {id, url}
  const [imageIds, setImageIds] = useState([]); // Хранит ID загруженных изображений
  const [createPost, { isLoading, error }] = useCreatePostMutation(); // Замените на ваш хук для создания поста
  const user = useSelector((state) => state.auth.user);
  const auth = useSelector((state) => state.auth);
  const userProfile = user?.UserFindOne;

  // Состояния для Snackbar
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Состояния для модального окна
  const [openModal, setOpenModal] = useState(false);

  // Используем хук для загрузки изображений
  const { uploadFiles, isUploading: isUploadingFile, error: uploadError } = useFileUpload(`${BASE_URL}/upload`, auth.token);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/gif': ['.gif']
    },
    multiple: true, // Разрешаем выбор нескольких файлов
    onDrop: useCallback(async (acceptedFiles) => {
      // Создаем уникальные идентификаторы для файлов
      const newImages = acceptedFiles.map(file => {
        const url = URL.createObjectURL(file);
        return { file, url };
      });

      // Проверяем уникальность изображений
      const existingUrls = new Set(images.map(img => img.url));
      const filteredNewImages = newImages.filter(img => !existingUrls.has(img.url));

      if (filteredNewImages.length > 0) {
        setImages(prevImages => [...prevImages, ...filteredNewImages]);

        try {
          const results = await uploadFiles(filteredNewImages.map(img => img.file));
          if (results.length > 0) {
            setImageIds(prevImageIds => [...prevImageIds, ...results.map(result => result.id)]);
            handleCloseModal(); // Закрываем модальное окно после успешной загрузки
          } else {
            console.error('Ошибка загрузки файлов:', uploadError);
          }
        } catch (err) {
          console.error('Ошибка при загрузке файлов:', err);
        }
      }
    }, [images, uploadFiles, uploadError]),
  });

  const handleSubmit = async () => {
    try {
      const imagesData = imageIds.map(id => ({ _id: id }));
      const postPayload = {
        title,
        text,
        images: imagesData,
      };

      await createPost(postPayload).unwrap();
      
      setSnackbarMessage('Пост успешно создан!');
      setOpenSnackbar(true);

      setTimeout(() => {
        navigate('/myProfile');
      }, 2000); // Задержка 2 секунды
    } catch (err) {
      console.error('Ошибка при создании поста:', err);
      setSnackbarMessage('Ошибка при создании поста.');
      setOpenSnackbar(true);
    }
  };

  const handleLogoClick = () => {
    navigate('/main');
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleProfileClick = () => {
    navigate('/myProfile');
    dispatch(actionAboutMe());
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // Функция для обработки перетаскивания изображений
  const handleDragStart = (index) => (e) => {
    e.dataTransfer.setData('text/plain', index.toString()); // Убедитесь, что индекс преобразован в строку
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const draggedIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    const targetIndex = parseInt(e.currentTarget.dataset.index, 10);

    if (draggedIndex !== targetIndex) {
      const newImages = [...images];
      const [draggedImage] = newImages.splice(draggedIndex, 1); // Удаляем перетаскиваемое изображение
      newImages.splice(targetIndex, 0, draggedImage); // Вставляем его в новое место
      setImages(newImages);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" onClick={handleLogoClick} sx={{ cursor: 'pointer' }}>Hipstagram</Typography>
          <SearchBar />
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {userProfile ? (
              <>
                <Avatar
                  alt={userProfile.nick || userProfile.login}
                  src={userProfile.avatar?.url ? new URL(userProfile.avatar.url, BASE_URL).href : '/default-avatar.png'}
                  sx={{ cursor: 'pointer' }}
                  onClick={handleProfileClick}
                />
                <Typography
                  variant="h6"
                  sx={{ marginLeft: '11px', marginRight: '8px', cursor: 'pointer' }}
                  onClick={handleProfileClick}
                >
                  {userProfile.nick || userProfile.login}
                </Typography>
              </>
            ) : (
              auth.token ? (
                <CircularProgress size={24} />
              ) : (
                <Typography variant="h6" color="error">Ошибка загрузки</Typography>
              )
            )}
            <IconButton onClick={handleLogout} color="inherit">
              <ExitToAppIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Box sx={{ padding: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', maxWidth: '1200px', width: '100%', gap: '20px', flexWrap: 'wrap' }}>
          <Box
            sx={{
              flex: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px dashed #ccc',
              borderRadius: '8px',
              padding: '32px',
              cursor: 'pointer',
              backgroundColor: '#f5f5f5',
              transition: 'background-color 0.3s ease',
              textAlign: 'center',
              position: 'relative',
              '&:hover': {
                backgroundColor: '#e0f7fa',
              },
            }}
            onClick={handleOpenModal}
          >
            {!images.length && (
              <Typography variant="body1">
                Нажмите здесь для загрузки изображений
              </Typography>
            )}
            {images.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '16px' }}>
                {images.map((image, index) => (
                  <Box
                    key={index}
                    sx={{ width: '150px', height: '150px', position: 'relative' }}
                    data-index={index}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                  >
                    <img
                      src={image.url}
                      alt={`Preview ${index}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        cursor: 'move',
                        position: 'absolute',
                        top: 0,
                        left: 0
                      }}
                      draggable
                      onDragStart={handleDragStart(index)}
                    />
                  </Box>
                ))}
              </Box>
            )}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" gutterBottom>Создать новый пост</Typography>
            <TextField
              fullWidth
              margin="normal"
              label="Название поста"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{ marginBottom: '8px' }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Описание поста"
              multiline
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              sx={{ marginBottom: '8px' }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={isLoading || isUploadingFile}
              sx={{ marginTop: '16px' }}
            >
              {isLoading || isUploadingFile ? <CircularProgress size={24} /> : 'Создать пост'}
            </Button>
            {error && <Typography color="error" sx={{ marginTop: '16px' }}>{error.message}</Typography>}
          </Box>
        </Box>
      </Box>

      {/* Модальное окно для загрузки изображений */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 800, // Ширина модального окна
          height: 400, // Высота модального окна
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', marginBottom: '16px' }}>
            Загрузите новые изображения
          </Typography>
          <Box
            {...getRootProps()}
            sx={{
              border: '2px dashed #ccc',
              borderRadius: '8px',
              padding: '32px',
              cursor: 'pointer',
              backgroundColor: isDragActive ? '#e0f7fa' : '#f5f5f5',
              transition: 'background-color 0.3s ease',
              textAlign: 'center',
              width: '90%', // Занимает всю ширину модального окна
              height: '100%', // Занимает всю высоту модального окна
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <Typography>Перетащите сюда изображения</Typography>
            ) : (
              <Typography>Перетащите сюда изображения или нажмите, чтобы выбрать</Typography>
            )}
          </Box>
        </Box>
      </Modal>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarMessage.includes('успешно') ? 'success' : 'error'}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreatePostPage;