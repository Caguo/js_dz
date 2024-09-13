// LoginForm.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { actionFullLogin, actionAboutMe } from '../redux/actions';

const LoginForm = () => {
  const [loginValue, setLoginValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [formError, setFormError] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError(false);

    try {
      await dispatch(actionFullLogin(loginValue, passwordValue));
      await dispatch(actionAboutMe()); // Запрашиваем данные о пользователе после входа
      navigate('/main');
    } catch (err) {
      console.error('Login error:', err);
      setFormError(true);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box mt={5}>
        <Typography variant="h4" align="center" gutterBottom>
          Вход
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Логин"
            fullWidth
            margin="normal"
            value={loginValue}
            onChange={(e) => setLoginValue(e.target.value)}
            required
            error={formError}
            helperText={formError ? 'Неправильный логин или пароль' : ''}
          />
          <TextField
            label="Пароль"
            type="password"
            fullWidth
            margin="normal"
            value={passwordValue}
            onChange={(e) => setPasswordValue(e.target.value)}
            required
            error={formError}
            helperText={formError ? 'Неправильный логин или пароль' : ''}
          />
          <Box mt={2}>
            <Button type="submit" fullWidth variant="contained" color="primary">
              Войти
            </Button>
          </Box>
          <Box mt={2}>
            <Typography variant="body2" align="center">
              Не зарегистрированы? <Link to="/register">Зарегистрируйтесь</Link>
            </Typography>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default LoginForm;
