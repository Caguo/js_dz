import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Box, Typography, Avatar, CircularProgress, AppBar, Toolbar, IconButton, Card, CardContent, CardMedia, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { logout } from '../redux/authSlice';
import { useFetchUserInfoQuery, useFetchUserPostsQuery, useToggleFollowMutation } from '../redux/userApiSlice';
import { useDropzone } from 'react-dropzone';

const MyProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openFollowersDialog, setOpenFollowersDialog] = useState(false);
  const [openFollowingDialog, setOpenFollowingDialog] = useState(false);
  const [followingUsers, setFollowingUsers] = useState([]);
  const [followersUsers, setFollowersUsers] = useState([]);
  const [toggleFollow] = useToggleFollowMutation();
  const [avatarPreview, setAvatarPreview] = useState(null); // Состояние для предпросмотра аватара

  const userLogin = localStorage.getItem('userLogin');
  const { data: userInfo, error: userError, isLoading: userLoading } = useFetchUserInfoQuery(userLogin);
  const userId = userInfo?._id;
  const { data: posts, error: postsError, isLoading: postsLoading } = useFetchUserPostsQuery(userId);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleLogoClick = () => {
    navigate('/main');
  };

  const handleOpenFollowers = () => {
    setFollowersUsers(userInfo?.followers || []);
    setOpenFollowersDialog(true);
  };

  const handleOpenFollowing = () => {
    setFollowingUsers(userInfo?.following || []);
    setOpenFollowingDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenFollowersDialog(false);
    setOpenFollowingDialog(false);
  };

  const handleToggleFollow = async (user, isFollowing) => {
    if (!userId) return;

    try {
      const response = await toggleFollow({ currentUserId: userId, targetUserId: user._id }).unwrap();
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
      setAvatarPreview(filePreview); // Устанавливаем новый URL для предпросмотра
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  if (userLoading || postsLoading) {
    return <CircularProgress />;
  }

  if (userError || postsError) {
    return <Typography variant="h6" color="error">Ошибка загрузки: {userError?.message || postsError?.message}</Typography>;
  }

  if (!userInfo) {
    return <Typography variant="h6">Данные пользователя не найдены</Typography>;
  }

  const followersCount = Array.isArray(userInfo.followers) ? userInfo.followers.length : 0;
  const followingCount = Array.isArray(userInfo.following) ? userInfo.following.length : 0;
  const postsCount = Array.isArray(posts) ? posts.length : 0;

  const isUserFollowing = (user) => {
    return (userInfo.following || []).some(f => f._id === user._id);
  };

  const getFollowButtonText = (user) => {
    return isUserFollowing(user) ? 'Отписаться' : 'Подписаться';
  };

  const getButtonColor = (user) => {
    return isUserFollowing(user) ? '#ccc' : '#4caf50';
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
            alt={userInfo.nick || userInfo.login}
            src={avatarPreview || userInfo.avatar?.url || '/default-avatar.png'} // Используем предпросмотр, если он есть
            sx={{ width: 120, height: 120 }}
          />
          
          <Box sx={{ marginLeft: '32px', textAlign: 'center' }}>
            <Typography variant="h5">{userInfo.nick || userInfo.login}</Typography>
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
            <Card key={post._id} sx={{ width: 180, maxWidth: '100%', margin: '4px' }}>
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
          ))}
        </Box>

        {/* Модальное окно для подписчиков */}
        <Dialog open={openFollowersDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>Подписчики</DialogTitle>
          <DialogContent>
            {followersUsers.length ? (
              followersUsers.map((user) => (
                <Box key={user._id} sx={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <Avatar src={user.avatar?.url || '/default-avatar.png'} sx={{ width: 40, height: 40, marginRight: '16px' }} />
                  <Typography variant="body1">{user.nick || user.login}</Typography>
                  <Button
                    variant="contained"
                    sx={{ marginLeft: 'auto', backgroundColor: getButtonColor(user) }}
                    onClick={() => handleToggleFollow(user, isUserFollowing(user))}
                  >
                    {getFollowButtonText(user)}
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
              followingUsers.map((user) => (
                <Box key={user._id} sx={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <Avatar src={user.avatar?.url || '/default-avatar.png'} sx={{ width: 40, height: 40, marginRight: '16px' }} />
                  <Typography variant="body1">{user.nick || user.login}</Typography>
                  <Button
                    variant="contained"
                    sx={{ marginLeft: 'auto', backgroundColor: getButtonColor(user) }}
                    onClick={() => handleToggleFollow(user, isUserFollowing(user))}
                  >
                    {getFollowButtonText(user)}
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
      </Box>
    </Box>
  );
};

export default MyProfilePage;
