import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Avatar, CircularProgress, AppBar, Toolbar, IconButton, Card, CardContent, CardMedia, Button, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { logout } from '../redux/authSlice';
import { useFetchUserInfoQuery, useFetchUserPostsQuery } from '../redux/userApiSlice';
import SearchBar from '../components/SearchBar';
import useToggleFollow from '../redux/useFollowUser';
import PostModal from '../hooks/PostModal'; // Import the PostModal component

const BASE_URL = 'http://hipstagram.node.ed.asmer.org.ua/'; // Убедитесь, что это правильный базовый URL

const UserProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { login } = useParams();
  const [openFollowersDialog, setOpenFollowersDialog] = useState(false);
  const [openFollowingDialog, setOpenFollowingDialog] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [showFollowButton, setShowFollowButton] = useState(true);

  // PostModal state
  const [selectedPost, setSelectedPost] = useState(null);
  const [showPostModal, setShowPostModal] = useState(false);

  // Получаем информацию о текущем пользователе
  const authUser = useSelector((state) => state.auth.user?.UserFindOne || {});
  const authId = authUser?._id;

  const { data: fetchedUserInfo, error: userError, isLoading: userLoading } = useFetchUserInfoQuery(login);
  const userId = fetchedUserInfo?._id;
  const { data: posts, error: postsError, isLoading: postsLoading } = useFetchUserPostsQuery(userId);

  const handleToggleFollow = useToggleFollow(
    (message) => {
      setSnackbarMessage(message);
      setSnackbarOpen(true);
      setUserInfo((prevInfo) => ({
        ...prevInfo,
        followers: [...(prevInfo.followers || []), fetchedUserInfo],
      }));
      setShowFollowButton(false);
    },
    (message) => {
      setSnackbarMessage(message);
      setSnackbarOpen(true);
    }
  );

  useEffect(() => {
    if (fetchedUserInfo) {
      setUserInfo(fetchedUserInfo);
      const isFollowing = fetchedUserInfo.followers.some(f => f._id === authId);
      setShowFollowButton(!isFollowing);
    }
  }, [fetchedUserInfo, authId]);

  useEffect(() => {
    if (posts) {
      const result = posts.filter(post =>
        post.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPosts(result);
    }
  }, [searchQuery, posts]);

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

  const handleCloseDialog = () => {
    setOpenFollowersDialog(false);
    setOpenFollowingDialog(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleOpenPostModal = (post) => {
    setSelectedPost(post);
    setShowPostModal(true);
  };

  const handleClosePostModal = () => {
    setShowPostModal(false);
    setSelectedPost(null);
  };

  const isUserFollowing = (user) => {
    if (!userInfo || !userInfo.following) return false;
    return (userInfo.following || []).some(f => f._id === user._id);
  };

  const getFollowButtonText = () => {
    return showFollowButton ? 'Подписаться' : 'Вы подписаны';
  };

  const getButtonColor = (user) => {
    return isUserFollowing(user) ? '#ccc' : '#4caf50';
  };

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

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" onClick={handleLogoClick} sx={{ cursor: 'pointer' }}>Hipstagram</Typography>
          <SearchBar onSearch={(query) => setSearchQuery(query)} />
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
            src={userInfo.avatar?.url ? `${BASE_URL}${userInfo.avatar.url}` : '/default-avatar.png'}
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
            {showFollowButton && (
              <Button
                sx={{
                  marginTop: '16px',
                  backgroundColor: '#4caf50',
                  color: '#fff',
                  borderRadius: '4px',
                }}
                onClick={() => handleToggleFollow(userInfo, 'follow')}
              >
                Подписаться
              </Button>
            )}
            {!showFollowButton && (
              <Button
                sx={{
                  marginTop: '16px',
                  backgroundColor: '#ccc',
                  color: '#fff',
                  borderRadius: '4px',
                }}
                disabled
              >
                Вы подписаны
              </Button>
            )}
          </Box>
        </Box>

        <Typography variant="h6" sx={{ textAlign: 'center', marginBottom: '33px' }}>Посты пользователя</Typography>
        <Box sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          justifyContent: 'center',
        }}>
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <Card
                key={post._id}
                sx={{
                  width: 300, // Увеличенный размер карточек
                  maxWidth: '100%',
                  borderRadius: '8px',
                  boxShadow: '0 6px 12px rgba(0,0,0,0.3)', // Увеличенная тень
                  transition: 'transform 0.3s',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                  overflow: 'hidden' // Обрезка содержимого карточки
                }}
                onClick={() => handleOpenPostModal(post)}
              >
                {post.images?.[0]?.url ? (
                  <CardMedia
                    component="img"
                    height="200" // Увеличенная высота изображения
                    image={`${BASE_URL}${post.images[0].url}`}
                    alt={post.title || 'Post image'}
                    sx={{ objectFit: 'cover' }} // Изображение будет занимать всю доступную площадь
                  />
                ) : (
                  <CardContent sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 200, // Увеличенная высота для отсутствующего изображения
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
                <CardContent sx={{ padding: '16px' }}>
                  <Typography variant="body1" color="textPrimary" sx={{ fontWeight: 'bold' }}>
                    {post.title || 'Без заголовка'}
                  </Typography>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center' }}>
              Нет постов, соответствующих запросу.
            </Typography>
          )}
        </Box>

        <Dialog open={openFollowersDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>Подписчики</DialogTitle>
          <DialogContent>
            {(userInfo.followers || []).map((follower) => (
              <Box key={follower._id} sx={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <Avatar src={follower.avatar?.url ? `${BASE_URL}${follower.avatar.url}` : '/default-avatar.png'} sx={{ width: 40, height: 40 }} />
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

        <Dialog open={openFollowingDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>Подписки</DialogTitle>
          <DialogContent>
            {(userInfo.following || []).map((followingUser) => (
              <Box key={followingUser._id} sx={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <Avatar src={followingUser.avatar?.url ? `${BASE_URL}${followingUser.avatar.url}` : '/default-avatar.png'} sx={{ width: 40, height: 40 }} />
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

        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>

        <PostModal
          open={showPostModal}
          onClose={handleClosePostModal}
          post={selectedPost}
          onLike={(postId) => console.log(`Like post with ID: ${postId}`)}
          onComment={(postId) => console.log(`Comment on post with ID: ${postId}`)}
        />
      </Box>
    </Box>
  );
};

export default UserProfilePage;
