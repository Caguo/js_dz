import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Avatar, CircularProgress, AppBar, Toolbar, IconButton, Card, CardContent, CardMedia, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { logout } from '../redux/authSlice';
import { useFetchUserPostsQuery, useToggleFollowMutation } from '../redux/userApiSlice';
import { useUpdateUserMutation } from '../redux/userAbout';
import { useDropzone } from 'react-dropzone';
import PostModal from '../hooks/PostModal'; // Убедитесь, что путь к PostModal верен

const MyProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openFollowersDialog, setOpenFollowersDialog] = useState(false);
  const [openFollowingDialog, setOpenFollowingDialog] = useState(false);
  const [followingUsers, setFollowingUsers] = useState([]);
  const [followersUsers, setFollowersUsers] = useState([]);
  const [toggleFollow] = useToggleFollowMutation();
  const [updateUser] = useUpdateUserMutation();
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [userNick, setUserNick] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [openPostDialog, setOpenPostDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const user = useSelector((state) => state.auth.user?.UserFindOne);

  // Получаем посты пользователя с помощью хука useFetchUserPostsQuery
  const { data: posts, error: postsError, isLoading: postsLoading } = useFetchUserPostsQuery(user?._id);

  useEffect(() => {
    if (user) {
      setFollowersUsers(user.followers || []);
      setFollowingUsers(user.following || []);
      setUserNick(user.nick || user.login);
    }
  }, [user]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleLogoClick = () => {
    navigate('/main');
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

  const handleToggleFollow = async (userToToggle) => {
    if (!user?._id) return;

    try {
      const response = await toggleFollow({ currentUserId: user._id, targetUserId: userToToggle._id }).unwrap();
      if (response) {
        setFollowersUsers(response.followers || []);
        setFollowingUsers(response.following || []);
      }
    } catch (error) {
      console.error('Ошибка обновления пользователя:', error);
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const filePreview = URL.createObjectURL(file);
      setAvatarPreview(filePreview);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleOpenPost = (post) => {
    setSelectedPost(post);
    setOpenPostDialog(true);
  };

  const handleUpdateProfile = async () => {
    if (!user?._id) return;

    const updatedData = {
      _id: user._id,
      avatar: avatarPreview,
      nick: userNick
    };

    try {
      // Обновляем локально перед запросом
      setUserNick(userNick);
      setAvatarPreview(avatarPreview);

      await updateUser(updatedData).unwrap();
      handleCloseDialog();
    } catch (error) {
      console.error('Ошибка обновления профиля:', error);
    }
  };

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

  const getFollowButtonText = (userToCheck) => {
    return isUserFollowing(userToCheck) ? 'Отписаться' : 'Подписаться';
  };

  const getButtonColor = (userToCheck) => {
    return isUserFollowing(userToCheck) ? '#ccc' : '#4caf50';
  };

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
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '144px',
            marginTop: '50px',
            justifyContent: 'center',
            position: 'relative'
          }}
        >
          <Box
            {...getRootProps()}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              border: '2px dashed #00f',
              background: isDragActive ? 'rgba(0,0,255,0.1)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10,
              opacity: isDragActive ? 1 : 0,
              transition: 'opacity 0.3s ease',
              '&:hover': {
                opacity: 1,
              }
            }}
          >
            <input {...getInputProps()} />
            <Typography variant="body2" color="text.white" align="center">Перетащите сюда</Typography>
          </Box>

          <Avatar
            alt={user.nick || user.login}
            src={avatarPreview || user.avatar?.url || '/default-avatar.png'}
            sx={{ width: 120, height: 120 }}
          />
          
          <Box sx={{ marginLeft: '32px', textAlign: 'center' }}>
            <Typography variant="h5">{user.nick || user.login}</Typography>
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

        {/* Посты */}
        <Typography variant="h6" sx={{ textAlign: 'center', marginBottom: '33px' }}>Ваши посты</Typography>
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '8px', 
          justifyContent: 'center'
        }}>
          {posts.map((post) => (
            <Box
              key={post._id}
              sx={{
                display: 'flex', 
                flexDirection: 'column', 
                cursor: 'pointer', 
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.05)',
                }
              }}
              onClick={() => handleOpenPost(post)}
            >
              <Card sx={{ width: 180, maxWidth: '100%', margin: '4px' }}>
                {post.images?.[0]?.url ? (
                  <CardMedia
                    component="img"
                    height="140"
                    image={post.images[0].url}
                    alt={post.title || 'Post image'}
                  />
                ) : (
                  <CardContent sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    height: 140, 
                    backgroundColor: '#f5f5f5', 
                    color: '#888',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}>
                    <Typography variant="body2" color="textSecondary">
                      Изображение отсутствует
                    </Typography>
                  </CardContent>
                )}
                <CardContent>
                  <Typography variant="body2" color="textSecondary">
                    {post.title || 'Без заголовка'}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>

        {/* Модальное окно для подписчиков */}
        <Dialog open={openFollowersDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>Подписчики</DialogTitle>
          <DialogContent>
            {followersUsers.length ? (
              followersUsers.map((userToDisplay) => (
                <Box key={userToDisplay._id} sx={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <Avatar src={userToDisplay.avatar?.url || '/default-avatar.png'} sx={{ width: 40, height: 40, marginRight: '16px' }} />
                  <Typography variant="body1">{userToDisplay.nick || userToDisplay.login}</Typography>
                  <Button
                    variant="contained"
                    sx={{ marginLeft: 'auto', backgroundColor: getButtonColor(userToDisplay) }}
                    onClick={() => handleToggleFollow(userToDisplay)}
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

        {/* Модальное окно для подписок */}
        <Dialog open={openFollowingDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>Подписки</DialogTitle>
          <DialogContent>
            {followingUsers.length ? (
              followingUsers.map((userToDisplay) => (
                <Box key={userToDisplay._id} sx={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <Avatar src={userToDisplay.avatar?.url || '/default-avatar.png'} sx={{ width: 40, height: 40, marginRight: '16px' }} />
                  <Typography variant="body1">{userToDisplay.nick || userToDisplay.login}</Typography>
                  <Button
                    variant="contained"
                    sx={{ marginLeft: 'auto', backgroundColor: getButtonColor(userToDisplay) }}
                    onClick={() => handleToggleFollow(userToDisplay)}
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

        {/* Модальное окно для поста */}
        <PostModal
          post={selectedPost}
          onClose={handleCloseDialog}
          onLikeToggle={(postId) => {
            // Добавьте логику для обработки лайков здесь
          }}
          likedPosts={{}} // Замените пустым объектом или передайте список лайкнутых постов
        />

        {/* Модальное окно для редактирования профиля */}
        <Dialog open={openEditDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>Редактировать профиль</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box
                {...getRootProps()}
                sx={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  border: '2px dashed #00f',
                  background: isDragActive ? 'rgba(0,0,255,0.1)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  marginBottom: '16px',
                }}
              >
                <input {...getInputProps()} />
                <Typography variant="body2" color="text.white" align="center">Перетащите сюда</Typography>
              </Box>
              <Avatar
                alt={user.nick || user.login}
                src={avatarPreview || user.avatar?.url || '/default-avatar.png'}
                sx={{ width: 120, height: 120, marginBottom: '16px' }}
              />
              <TextField
                label="Никнейм"
                variant="outlined"
                fullWidth
                value={userNick}
                onChange={(e) => setUserNick(e.target.value)}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Отмена</Button>
            <Button onClick={handleUpdateProfile} variant="contained">Сохранить</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default MyProfilePage;