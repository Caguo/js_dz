import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppBar, Toolbar, Typography, TextField, Box, Avatar, IconButton, Popper, Paper, MenuItem, CircularProgress } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/authSlice';
import { useSearchUsersQuery } from '../redux/userApiSlice';
import PostCard from '../components/PostCard';

const MainPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user); // Извлекаем данные пользователя
  console.log('User data:', user);

  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const inputRef = useRef(null);

  const { data: searchResults = [], isFetching } = useSearchUsersQuery(searchQuery, { skip: searchQuery.trim() === '' });

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleProfileClick = () => {
    navigate('/myProfile');
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    if (event.target.value.trim() !== '') {
      setAnchorEl(inputRef.current);
      setIsMenuOpen(true);
    } else {
      setIsMenuOpen(false);
    }
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchQuery.trim() !== '') {
      setAnchorEl(inputRef.current);
      setIsMenuOpen(true);
    }
  };

  const handleUserClick = (login) => {
    navigate(`/profile/${login}`);
    setIsMenuOpen(false); // Закрыть меню при выборе пользователя
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Hipstagram</Typography>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              maxWidth: '400px',
              margin: '0 auto',
              position: 'relative'
            }}
          >
            <form onSubmit={handleSearchSubmit} style={{ width: '100%' }}>
              <TextField
                ref={inputRef}
                placeholder="Поиск…"
                value={searchQuery}
                onChange={handleSearchChange}
                variant="outlined"
                size="small"
                fullWidth
                sx={{
                  backgroundColor: 'white',
                  borderRadius: '4px',
                  boxShadow: 1,
                }}
                InputProps={{
                  endAdornment: isFetching ? <CircularProgress size={24} /> : null,
                }}
              />
            </form>
            <Popper
              open={isMenuOpen}
              anchorEl={anchorEl}
              placement="bottom-start"
              style={{ zIndex: 1, width: inputRef.current ? inputRef.current.clientWidth : '100%' }}
              modifiers={[
                {
                  name: 'offset',
                  options: {
                    offset: [0, 4], // Уменьшите отступ
                  },
                },
              ]}
            >
              <Paper
                sx={{
                  maxHeight: '200px', // Установите максимальную высоту для скролла
                  overflowY: 'auto', // Добавьте скролл
                  width: '100%', // Убедитесь, что ширина совпадает с полем ввода
                }}
              >
                {searchResults.length > 0 ? (
                  searchResults.map((user) => (
                    <MenuItem
                      key={user._id}
                      onClick={() => handleUserClick(user.login)}
                      sx={{ display: 'flex', alignItems: 'center' }}
                    >
                      <Avatar alt={user.nick || user.login} src={user.avatar?.url || '/default-avatar.png'} sx={{ width: 30, height: 30, marginRight: 1 }} />
                      <Typography variant="body1" noWrap sx={{ overflow: 'hidden' }}>
                        {user.nick || user.login}
                      </Typography>
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>Ничего не найдено</MenuItem>
                )}
              </Paper>
            </Popper>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {user ? (
              <>
                <Avatar
                  alt={user.nick || user.login}
                  src={user.avatar?.url || '/default-avatar.png'}
                  sx={{ cursor: 'pointer' }}
                  onClick={handleProfileClick}
                />
                <Typography
                  variant="h6"
                  sx={{ marginLeft: '11px', marginRight: '8px', cursor: 'pointer' }}
                  onClick={handleProfileClick}
                >
                  {user.nick || user.login}
                </Typography>
              </>
            ) : (
              <Typography variant="h6" color="error">Ошибка загрузки</Typography>
            )}
            <IconButton onClick={handleLogout} color="inherit">
              <ExitToAppIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ marginTop: '20px' }}>
        {/* Здесь отображаются посты */}
        <PostCard />
      </Box>
    </Box>
  );
};

export default MainPage;
