import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppBar, Toolbar, Typography, Box, Avatar, IconButton, CircularProgress } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/authSlice';
import { actionAboutMe } from '../redux/actions';
import PostCard from '../components/PostCard';
import SearchBar from '../components/SearchBar'; // Import the SearchBar component

const BASE_URL = 'http://hipstagram.node.ed.asmer.org.ua/';

const PostsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const auth = useSelector((state) => state.auth);
  
  useEffect(() => {
    if (!user && auth.token) {
      dispatch(actionAboutMe());
    }
  }, [user, auth.token, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleProfileClick = () => {
    navigate('/myProfile');
  };

  const userProfile = user?.UserFindOne;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ cursor: 'pointer' }} onClick={() => navigate('/main')}>
            Hipstagram
          </Typography>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              maxWidth: '400px',
              margin: '0 auto',
            }}
          >
            <SearchBar /> {/* Use the SearchBar component */}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {userProfile ? (
              <>
                <Avatar
                  alt={userProfile.nick || userProfile.login}
                  src={userProfile.avatar?.url ? `${BASE_URL}${userProfile.avatar.url}` : '/default-avatar.png'}
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

      <Box sx={{ marginTop: '20px' }}>
        <PostCard />
      </Box>
    </Box>
  );
};

export default PostsPage;
