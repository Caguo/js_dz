import React, { useState, useRef } from 'react';
import { Box, TextField, Popper, Paper, MenuItem, Avatar, Typography, CircularProgress, IconButton, Menu, Select, MenuItem as SelectMenuItem, FormControl, InputLabel } from '@mui/material';
import { useSearchUsersQuery } from '../redux/userApiSlice';
import { useNavigate } from 'react-router-dom';
import FilterListIcon from '@mui/icons-material/FilterList'; // Icon for opening filter menu

const BASE_URL = 'http://hipstagram.node.ed.asmer.org.ua/'; // Import the BASE_URL

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null); // Anchor element for filter menu
  const [searchField, setSearchField] = useState('login'); // Filter type
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Modify query based on the selected filter type
  const { data: searchResults = [], isFetching } = useSearchUsersQuery({ searchQuery, searchField }, { skip: searchQuery.trim() === '' });

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
    setIsMenuOpen(false);
  };

  const handlePostClick = () => {
    navigate('/post');
    setIsMenuOpen(false);
  };

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleFilterChange = (event) => {
    setSearchField(event.target.value);
    handleFilterClose();
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: '100%', // Ensure full width for the container
        maxWidth: '400px', // Set a maximum width for the search bar
        margin: '0 auto', // Center the search bar horizontally
        position: 'relative',
      }}
    >
      <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
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
            marginRight: 1,
          }}
          InputProps={{
            endAdornment: isFetching ? <CircularProgress size={24} /> : null,
          }}
        />
        <IconButton onClick={handleFilterClick} sx={{ padding: '10px' }}>
          <FilterListIcon />
        </IconButton>
      </form>
      <Popper
        open={isMenuOpen}
        anchorEl={anchorEl}
        placement="bottom-start"
        style={{ zIndex: 1, width: inputRef.current ? inputRef.current.clientWidth : '100%', marginTop: 0 }}
        modifiers={[{
          name: 'offset',
          options: {
            offset: [0, 0],
          },
        }]}
      >
        <Paper
          sx={{
            maxHeight: '200px',
            overflowY: 'auto',
            width: '100%',
            marginTop: 0,
          }}
        >
          {searchResults.length > 0 ? (
            searchResults.map((user) => (
              <MenuItem
                key={user._id}
                onClick={() => handleUserClick(user.login)}
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                <Avatar
                  alt={user.nick || user.login}
                  src={user.avatar?.url ? `${BASE_URL}${user.avatar.url}` : '/default-avatar.png'}
                  sx={{ width: 30, height: 30, marginRight: 1 }}
                />
                <Typography variant="body1" noWrap sx={{ overflow: 'hidden' }}>
                  {searchField === 'login' ? user.login : user.nick}
                </Typography>
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>Ничего не найдено</MenuItem>
          )}
          {searchQuery && (
            <MenuItem onClick={handlePostClick} sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body1" sx={{ overflow: 'hidden', marginLeft: 1 }}>
                Перейти к постам
              </Typography>
            </MenuItem>
          )}
        </Paper>
      </Popper>
      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={handleFilterClose}
        sx={{ marginTop: 1 }}
      >
        <Box sx={{ padding: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Фильтр по</InputLabel>
            <Select
              value={searchField}
              onChange={handleFilterChange}
              label="Фильтр по"
            >
              <SelectMenuItem value="login">По логину</SelectMenuItem>
              <SelectMenuItem value="nick">По нику</SelectMenuItem>
            </Select>
          </FormControl>
        </Box>
      </Menu>
    </Box>
  );
};

export default SearchBar;
