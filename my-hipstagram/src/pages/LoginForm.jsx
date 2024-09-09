import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { useLoginMutation } from '../redux/authApiSlice';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../redux/authSlice';

const LoginForm = () => {
  const [loginValue, setLoginValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [formError, setFormError] = useState(false);

  const dispatch = useDispatch();
  const [login, { isLoading, isError, error }] = useLoginMutation();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError(false);
  
    try {
      const result = await login({ login: loginValue, password: passwordValue }).unwrap();
      console.log('Login result:', result);

      const token = result?.login;
      const user = result?.login.user; // Если данные пользователя не возвращаются в API, используйте это значение

      if (token) {
        dispatch(setCredentials({ token, user }));
        navigate('/main');
      } else {
        setFormError(true);
      }
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
            autoComplete="username"
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
            autoComplete="current-password"
            error={formError}
            helperText={formError ? 'Неправильный логин или пароль' : ''}
          />
          <Box mt={2}>
            <Button type="submit" fullWidth variant="contained" color="primary" disabled={isLoading}>
              Войти
            </Button>
          </Box>
          {isError && <Typography color="error">{error?.data?.message || 'Ошибка входа'}</Typography>}
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