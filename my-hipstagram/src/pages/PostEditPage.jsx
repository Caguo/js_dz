import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box, Button, TextField, Typography, CircularProgress, AppBar, Toolbar, Avatar, IconButton, Snackbar, Alert, Modal
} from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import DeleteIcon from '@mui/icons-material/Delete'; // Импортируйте иконку для удаления
import { useUpdatePostMutation, useDeletePostMutation, useGetPostQuery } from '../redux/postsApiSlice'; // Обновите путь к API
import SearchBar from '../components/SearchBar';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';
import { actionAboutMe } from '../redux/actions';
import { useDropzone } from 'react-dropzone';
import useFileUpload from '../hooks/useFileUpload'; // Убедитесь, что путь корректен

const BASE_URL = 'http://hipstagram.node.ed.asmer.org.ua'; // Ваш базовый URL

const PostEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Используем 'id' вместо 'postId'
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [images, setImages] = useState([]); // Хранит объекты изображений {id, url}
  const [imageIds, setImageIds] = useState([]); // Хранит ID загруженных изображений
  const [updatePost, { isLoading: isUpdating, error: updateError }] = useUpdatePostMutation();
  const [deletePost, { isLoading: isDeleting, error: deleteError }] = useDeletePostMutation();
  const { data: post, isLoading: isPostLoading } = useGetPostQuery(id); // Используем 'id' для запроса
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

  useEffect(() => {
    if (post) {
      setTitle(post.title || '');
      setText(post.text || '');
      setImages((post.images || []).map(img => ({ id: img._id, url: img.url })));
      setImageIds((post.images || []).map(img => img._id));
    }
  }, [post]);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/gif': ['.gif']
    },
    multiple: true,
    onDrop: useCallback(async (acceptedFiles) => {
      const newImages = acceptedFiles.map(file => {
        const url = URL.createObjectURL(file);
        return { file, url };
      });

      const existingUrls = new Set(images.map(img => img.url));
      const filteredNewImages = newImages.filter(img => !existingUrls.has(img.url));

      if (filteredNewImages.length > 0) {
        setImages(prevImages => [...prevImages, ...filteredNewImages]);

        try {
          const results = await uploadFiles(filteredNewImages.map(img => img.file));
          if (results.length > 0) {
            setImageIds(prevImageIds => [...prevImageIds, ...results.map(result => result.id)]);
            handleCloseModal();
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
        _id: id, // Используем 'id' для обновления поста
        title,
        text,
        images: imagesData,
      };

      await updatePost(postPayload).unwrap();
      
      setSnackbarMessage('Пост успешно обновлен!');
      setOpenSnackbar(true);

      setTimeout(() => {
        navigate('/myProfile');
      }, 2000); // Задержка 2 секунды
    } catch (err) {
      console.error('Ошибка при обновлении поста:', err);
      setSnackbarMessage('Ошибка при обновлении поста.');
      setOpenSnackbar(true);
    }
  };

  const handleDelete = async () => {
    try {
      await deletePost(id).unwrap();
      
      setSnackbarMessage('Пост успешно удален!');
      setOpenSnackbar(true);

      setTimeout(() => {
        navigate('/myProfile');
      }, 2000); // Задержка 2 секунды
    } catch (err) {
      console.error('Ошибка при удалении поста:', err);
      setSnackbarMessage('Ошибка при удалении поста.');
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

  const handleDragStart = (index) => (e) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const draggedIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    const targetIndex = parseInt(e.currentTarget.dataset.index, 10);

    if (draggedIndex !== targetIndex) {
      const newImages = [...images];
      const [draggedImage] = newImages.splice(draggedIndex, 1);
      newImages.splice(targetIndex, 0, draggedImage);
      setImages(newImages);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDeleteImage = (index) => () => {
    const newImages = images.filter((_, i) => i !== index);
    const newImageIds = imageIds.filter((_, i) => i !== index);
    setImages(newImages);
    setImageIds(newImageIds);
  };

  if (isPostLoading) return <CircularProgress />;

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
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={handleDeleteImage(index)}
                      sx={{
                        position: 'absolute',
                        top: 5,
                        right: 5,
                        zIndex: 1
                      }}
                    >
                      Удалить
                    </Button>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" gutterBottom>Редактировать пост</Typography>
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
              disabled={isUpdating || isUploadingFile}
              sx={{ marginTop: '16px' }}
            >
              {isUpdating || isUploadingFile ? <CircularProgress size={24} /> : 'Сохранить изменения'}
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDelete}
              disabled={isDeleting}
              sx={{ marginTop: '16px', marginLeft: '16px' }}
            >
              {isDeleting ? <CircularProgress size={24} /> : <><DeleteIcon sx={{ marginRight: '8px' }} />Удалить пост</>}
            </Button>
            {updateError && <Typography color="error" sx={{ marginTop: '16px' }}>{updateError.message}</Typography>}
            {deleteError && <Typography color="error" sx={{ marginTop: '16px' }}>{deleteError.message}</Typography>}
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
          width: 800,
          height: 400,
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
              width: '90%',
              height: '100%',
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

export default PostEditPage;
