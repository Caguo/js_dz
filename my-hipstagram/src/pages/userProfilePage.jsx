import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Box, Typography, Avatar, CircularProgress, AppBar, Toolbar, IconButton, Card, CardContent, CardMedia, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { logout } from '../redux/authSlice';
import { useFetchUserInfoQuery, useFetchUserPostsQuery, useToggleFollowMutation } from '../redux/userApiSlice';

const UserProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { login } = useParams();  // Получаем логин пользователя из параметров маршрута
  const [openFollowersDialog, setOpenFollowersDialog] = useState(false);
  const [openFollowingDialog, setOpenFollowingDialog] = useState(false);
  const [followingUsers, setFollowingUsers] = useState([]);
  const [followersUsers, setFollowersUsers] = useState([]);
  
  const { data: userInfo, error: userError, isLoading: userLoading } = useFetchUserInfoQuery(login);  // Загружаем данные пользователя по логину
  const userId = userInfo?._id;
  const { data: posts, error: postsError, isLoading: postsLoading } = useFetchUserPostsQuery(userId);
  const [toggleFollow] = useToggleFollowMutation();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleLogoClick = () => {
    navigate('/main');
  };

  const handleOpenFollowers = () => {
    setFollowersUsers(userInfo.followers || []);
    setOpenFollowersDialog(true);
  };

  const handleOpenFollowing = () => {
    setFollowingUsers(userInfo.following || []);
    setOpenFollowingDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenFollowersDialog(false);
    setOpenFollowingDialog(false);
  };

  const handleToggleFollow = async (user, action) => {
    if (!userId) return;
  
    const variables = {
      currentUserId: userId,
      targetUserId: user._id,
    };
  
    try {
      const response = await toggleFollow(variables).unwrap();
      if (response) {
        if (action === 'follow') {
          setFollowersUsers(prev => [...prev, user]);
        } else {
          setFollowersUsers(prev => prev.filter(f => f._id !== user._id));
        }
      } else {
        console.error('Server returned null:', response);
      }
    } catch (error) {
      console.error('Ошибка при изменении подписки', error);
    }
  };

  useEffect(() => {
    if (userInfo) {
      // Дополнительная логика, если нужно
    }
  }, [userInfo]);

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

  const isUserFollowedBy = (user) => {
    return (userInfo.followers || []).some(f => f._id === user._id);
  };

  const getFollowButtonText = (user) => {
    if (isUserFollowing(user) && isUserFollowedBy(user)) {
      return 'Подписан';
    }
    return isUserFollowing(user) ? 'Подписан' : 'Подписаться';
  };

  const getButtonColor = (user) => {
    if (isUserFollowing(user) && isUserFollowedBy(user)) {
      return '#ccc'; // Цвет для подписанных пользователей
    }
    return isUserFollowing(user) ? '#ccc' : '#4caf50'; // Цвет для подписанных или не подписанных пользователей
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

      <Box sx={{ padding: '16px' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '144px',
            marginTop: '50px',
            justifyContent: 'center',
          }}
        >
          <Avatar
            alt={userInfo.nick || userInfo.login}
            src={userInfo.avatar?.url || '/default-avatar.png'}
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
            <Button
              sx={{
                marginTop: '16px',
                backgroundColor: getButtonColor(userInfo),
                color: '#fff',
                borderRadius: '4px',
              }}
              onClick={() => handleToggleFollow(userInfo, isUserFollowing(userInfo) ? 'unfollow' : 'follow')}
            >
              {getFollowButtonText(userInfo)}
            </Button>
          </Box>
        </Box>

        {/* Посты */}
        <Typography variant="h6" sx={{ textAlign: 'center', marginBottom: '33px' }}>Посты пользователя</Typography>
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
            {followersUsers.map((follower) => (
              <Box key={follower._id} sx={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <Avatar src={follower.avatar?.url || '/default-avatar.png'} sx={{ width: 40, height: 40 }} />
                <Box sx={{ marginLeft: '16px', flexGrow: 1 }}>
                  <Typography variant="body1">{follower.nick || follower.login}</Typography>
                </Box>
                <Button 
                  sx={{ backgroundColor: getButtonColor(follower), color: '#fff', borderRadius: '4px' }}
                  onClick={() => handleToggleFollow(follower, isUserFollowing(follower) ? 'unfollow' : 'follow')}
                >
                  {getFollowButtonText(follower)}
                </Button>
              </Box>
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">Закрыть</Button>
          </DialogActions>
        </Dialog>

        {/* Модальное окно для подписок */}
        <Dialog open={openFollowingDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>Подписки</DialogTitle>
          <DialogContent>
            {followingUsers.map((followingUser) => (
              <Box key={followingUser._id} sx={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <Avatar src={followingUser.avatar?.url || '/default-avatar.png'} sx={{ width: 40, height: 40 }} />
                <Box sx={{ marginLeft: '16px', flexGrow: 1 }}>
                  <Typography variant="body1">{followingUser.nick || followingUser.login}</Typography>
                </Box>
                <Button 
                  sx={{ backgroundColor: getButtonColor(followingUser), color: '#fff', borderRadius: '4px' }}
                  onClick={() => handleToggleFollow(followingUser, isUserFollowing(followingUser) ? 'unfollow' : 'follow')}
                >
                  {getFollowButtonText(followingUser)}
                </Button>
              </Box>
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">Закрыть</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default UserProfilePage;
