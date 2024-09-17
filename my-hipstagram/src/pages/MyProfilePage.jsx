import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Typography, Avatar, CircularProgress, AppBar, Toolbar, IconButton,
  Card, CardContent, CardMedia, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit'; // Импорт иконки редактирования
import { useNavigate } from 'react-router-dom';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { logout } from '../redux/authSlice';
import { useFetchUserPostsQuery } from '../redux/userApiSlice';
import { useUpdateUserMutation } from '../redux/userAbout';
import { useDropzone } from 'react-dropzone';
import { actionAboutMe } from '../redux/actions';
import PostModal from '../hooks/PostModal';
import useToggleFollow from '../redux/useFollowUser';
import useFileUpload from '../hooks/useFileUpload';

const BASE_URL = 'http://hipstagram.node.ed.asmer.org.ua/';

const MyProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openFollowersDialog, setOpenFollowersDialog] = useState(false);
  const [openFollowingDialog, setOpenFollowingDialog] = useState(false);
  const [followingUsers, setFollowingUsers] = useState([]);
  const [followersUsers, setFollowersUsers] = useState([]);
  const [updateUser] = useUpdateUserMutation();
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [userNick, setUserNick] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [openPostDialog, setOpenPostDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [currentAvatarId, setCurrentAvatarId] = useState(null);

  const user = useSelector((state) => state.auth.user.UserFindOne);

  const { data: posts, error: postsError, isLoading: postsLoading } = useFetchUserPostsQuery(user?._id);

  const handleToggleFollow = useToggleFollow(
    (message) => {
      console.log(message);
    },
    (error) => {
      console.error(error);
    }
  );

  const token = useSelector(state => state.auth.token);

  useEffect(() => {
    if (user) {
      setFollowersUsers(user.followers || []);
      setFollowingUsers(user.following || []);
      setUserNick(user.nick || user.login);
      setAvatarPreview(user.avatar?.url ? `${BASE_URL}${user.avatar.url}` : null);
    }
  }, [user]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleLogoClick = () => {
    navigate('/main');
    dispatch(actionAboutMe());
  };

  const handleOpenFollowers = () => {
    setOpenFollowersDialog(true);
  };

  const handleOpenFollowing = () => {
    setOpenFollowingDialog(true);
  };

  const handleOpenEditProfile = () => {
    setOpenEditDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenFollowersDialog(false);
    setOpenFollowingDialog(false);
    setOpenPostDialog(false);
    setOpenEditDialog(false);
    setSelectedPost(null);
  };

  const handleFollowToggle = async (userToToggle, action) => {
    try {
      await handleToggleFollow(userToToggle, action).unwrap();
      dispatch(actionAboutMe());
      if (action === 'follow') {
        setFollowersUsers(prevFollowers => [...prevFollowers, userToToggle]);
      } else {
        setFollowersUsers(prevFollowers => prevFollowers.filter(user => user._id !== userToToggle._id));
      }
      if (isUserFollowing(userToToggle)) {
        setFollowingUsers(prevFollowing => prevFollowing.filter(user => user._id !== userToToggle._id));
      } else {
        setFollowingUsers(prevFollowing => [...prevFollowing, userToToggle]);
      }
    } catch (error) {
      console.error('Ошибка при изменении подписки:', error);
    }
  };

  const { uploadFiles, isUploading: isUploadingFiles, error: uploadError } = useFileUpload(`${BASE_URL}upload`, token);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: true,
    onDrop: useCallback(async (acceptedFiles) => {
      setAvatarPreview(null);
      try {
        const results = await uploadFiles(acceptedFiles);
        if (results.length > 0) {
          setAvatarPreview(results[0]?.url || null);
          setCurrentAvatarId(results[0]?.id || null);
        } else {
          console.error('Ошибка загрузки файлов:', uploadError);
        }
      } catch (err) {
        console.error('Ошибка при загрузке файлов:', err);
      }
    }, [uploadFiles, uploadError]),
  });

  const handleOpenPost = (post) => {
    setSelectedPost(post);
    setOpenPostDialog(true);
  };

  useEffect(() => {
    if (user.avatar?._id) {
      setCurrentAvatarId(user.avatar._id);
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    if (!user?._id) return;
    const updatedData = {
      _id: user._id,
      avatar: {
        _id: currentAvatarId || null,
      },
      nick: userNick
    };
    try {
      const response = await updateUser(updatedData).unwrap();
      dispatch(actionAboutMe());
      setAvatarPreview(response.avatar?.url ? `${BASE_URL}${response.avatar.url}` : avatarPreview);
      setUserNick(response.nick || userNick);
      handleCloseDialog();
    } catch (error) {
      console.error('Ошибка обновления профиля:', error);
      if (error.response) {
        console.error('Сервер ответил ошибкой:', error.response.data);
      } else {
        console.error('Ошибка в запросе:', error.message);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  useEffect(() => {
    if (openFollowersDialog || openFollowingDialog) {
      setFollowersUsers(user.followers || []);
      setFollowingUsers(user.following || []);
    }
  }, [openFollowersDialog, openFollowingDialog, user]);

  if (postsLoading) {
    return <CircularProgress />;
  }

  if (postsError) {
    return <Typography variant="h6" color="error">Ошибка загрузки постов: {postsError.message}</Typography>;
  }

  if (!user) {
    return <Typography variant="h6">Данные пользователя не найдены</Typography>;
  }

  const followersCount = Array.isArray(user.followers) ? user.followers.length : 0;
  const followingCount = Array.isArray(user.following) ? user.following.length : 0;
  const postsCount = Array.isArray(posts) ? posts.length : 0;

  const isUserFollowing = (userToCheck) => {
    return (user.following || []).some(f => f._id === userToCheck._id);
  };

  const getButtonColor = (userToDisplay) => {
    return isUserFollowing(userToDisplay) ? '#ccc' : '#4caf50';
  };

  const getFollowButtonText = (userToDisplay) => {
    return isUserFollowing(userToDisplay) ? 'Отписаться' : 'Подписаться';
  };

  const handleCreatePost = () => {
    navigate('/createPost');
  };

  const handleEditPost = (postId) => {
    navigate(`/postEdit/${postId}`);
  };

  const sortedPosts = (posts || []).slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" onClick={handleLogoClick} sx={{ cursor: 'pointer' }}>Hipstagram</Typography>
          <IconButton onClick={handleLogout} color="inherit">
            <ExitToAppIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box sx={{ padding: '16px', position: 'relative' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '144px', marginTop: '50px', justifyContent: 'center' }}>
          <Avatar
            alt={user.nick || user.login}
            src={avatarPreview || user.avatar?.url ? `${BASE_URL}${user.avatar.url}` : '/default-avatar.png'}
            sx={{ width: 120, height: 120 }}
          />
          <Box sx={{ marginLeft: '32px', textAlign: 'center' }}>
            <Typography variant="h5">{userNick}</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '8px' }}>
              <Box sx={{ margin: '0 8px' }}>
                <Typography variant="body2">Посты</Typography>
                <Typography variant="body1"><strong>{postsCount}</strong></Typography>
              </Box>
              <Box sx={{ margin: '0 8px', cursor: 'pointer' }} onClick={handleOpenFollowers}>
                <Typography variant="body2">Подписчики</Typography>
                <Typography variant="body1"><strong>{followersCount}</strong></Typography>
              </Box>
              <Box sx={{ margin: '0 8px', cursor: 'pointer' }} onClick={handleOpenFollowing}>
                <Typography variant="body2">Подписки</Typography>
                <Typography variant="body1"><strong>{followingCount}</strong></Typography>
              </Box>
            </Box>
            <Button variant="contained" color="primary" onClick={handleOpenEditProfile} sx={{ marginTop: '16px' }}>Редактировать профиль</Button>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '33px' }}>
          <Typography variant="h6">Ваши посты</Typography>
          <Button variant="contained" color="secondary" onClick={handleCreatePost}>
            Создать пост
          </Button>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
          {sortedPosts.map((post) => {
            const imageUrl = post.images && post.images.length > 0 ? `${BASE_URL}${post.images[0].url}` : '';

            return (
              <Card
                key={post._id}
                sx={{
                  width: 'calc(33.33% - 16px)', // 3 поста в ряду с отступом
                  maxWidth: '600px',
                  minWidth: '300px',
                  display: 'flex',
                  flexDirection: 'column',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  boxShadow: 2,
                  height: 'auto',
                  position: 'relative',
                }}
                onClick={() => handleOpenPost(post)}
              >
                {imageUrl ? (
                  <CardMedia
                    component="img"
                    height="250"
                    image={imageUrl}
                    alt={post.title || 'Post image'}
                    sx={{ objectFit: 'cover' }}
                  />
                ) : (
                  <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '250px', backgroundColor: '#f5f5f5', color: '#888' }}>
                    <Typography variant="body2">Изображение отсутствует</Typography>
                  </CardContent>
                )}
                <CardContent>
                  <Typography variant="h6">{post.title}</Typography>
                </CardContent>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering Card click
                    handleEditPost(post._id); // Обработчик редактирования поста
                  }}
                  sx={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    backgroundColor: 'blue',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'darkblue',
                    }
                  }}
                >
                  <EditIcon />
                </IconButton>
              </Card>
            );
          })}
        </Box>
      </Box>

      <Dialog open={openFollowersDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Подписчики</DialogTitle>
        <DialogContent>
          {followersUsers.length ? (
            followersUsers.map((userToDisplay) => (
              <Box key={userToDisplay._id} sx={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <Avatar src={userToDisplay.avatar?.url ? `${BASE_URL}${userToDisplay.avatar.url}` : '/default-avatar.png'} sx={{ width: 40, height: 40, marginRight: '16px' }} />
                <Typography variant="body1">{userToDisplay.nick || userToDisplay.login}</Typography>
                <Button
                  variant="contained"
                  sx={{ marginLeft: 'auto', backgroundColor: getButtonColor(userToDisplay) }}
                  onClick={() => handleFollowToggle(userToDisplay, isUserFollowing(userToDisplay) ? 'unfollow' : 'follow')}
                >
                  {getFollowButtonText(userToDisplay)}
                </Button>
              </Box>
            ))
          ) : (
            <Typography>У вас нет подписчиков</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Закрыть</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openFollowingDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Подписки</DialogTitle>
        <DialogContent>
          {followingUsers.length ? (
            followingUsers.map((userToDisplay) => (
              <Box key={userToDisplay._id} sx={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <Avatar src={userToDisplay.avatar?.url ? `${BASE_URL}${userToDisplay.avatar.url}` : '/default-avatar.png'} sx={{ width: 40, height: 40, marginRight: '16px' }} />
                <Typography variant="body1">{userToDisplay.nick || userToDisplay.login}</Typography>
                <Button
                  variant="contained"
                  sx={{ marginLeft: 'auto', backgroundColor: getButtonColor(userToDisplay) }}
                  onClick={() => handleFollowToggle(userToDisplay, isUserFollowing(userToDisplay) ? 'unfollow' : 'follow')}
                >
                  {getFollowButtonText(userToDisplay)}
                </Button>
              </Box>
            ))
          ) : (
            <Typography>Вы не на кого не подписаны</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Закрыть</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Редактировать профиль</DialogTitle>
        <DialogContent>
          <Box {...getRootProps()} sx={{ border: '1px dashed gray', padding: '16px', borderRadius: '4px', textAlign: 'center' }}>
            <input {...getInputProps()} />
            {isDragActive ? <Typography>Перетащите сюда изображение...</Typography> : <Typography>Перетащите сюда изображение или нажмите для выбора файла</Typography>}
            {avatarPreview && <Avatar src={avatarPreview} sx={{ width: 120, height: 120, marginTop: '16px' }} />}
            {isUploadingFiles && <CircularProgress />}
            {uploadError && <Typography color="error">{uploadError.message}</Typography>}
          </Box>
          <TextField
            fullWidth
            margin="normal"
            label="Никнейм"
            value={userNick}
            onChange={(e) => setUserNick(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Отмена</Button>
          <Button onClick={handleUpdateProfile} color="primary">Сохранить</Button>
        </DialogActions>
      </Dialog>

      {selectedPost && (
        <PostModal
          post={selectedPost}
          open={openPostDialog}
          onClose={handleCloseDialog}
        />
      )}
    </Box>
  );
};

export default MyProfilePage;
