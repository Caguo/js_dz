import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, Snackbar, Alert } from '@mui/material';
import { useRegisterMutation } from '../redux/authApiSlice';

const RegisterForm = () => {
  const [loginValue, setLoginValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [confirmPasswordValue, setConfirmPasswordValue] = useState('');
  const [loginError, setLoginError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [registrationError, setRegistrationError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const [register] = useRegisterMutation();
  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();
    setLoginError('');
    setPasswordError('');
    setRegistrationError('');

    // Проверка, что пароли совпадают
    if (passwordValue !== confirmPasswordValue) {
      setPasswordError('Пароли не совпадают');
      return;
    }

    try {
      const result = await register({ login: loginValue, password: passwordValue }).unwrap();

      // Проверка, существует ли пользователь
      if (result?.createUser === null) {
        setLoginError('Этот логин уже занят. Пожалуйста, выберите другой.');
      } else {
        // Успешная регистрация
        setSnackbarOpen(true);
        setTimeout(() => navigate('/'), 2000); // Переход через 2 секунды, чтобы показать уведомление
      }
    } catch (err) {
      console.error('Registration error:', err);
      setRegistrationError('Ошибка регистрации. Попробуйте позже.');
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="xs">
      <Box mt={2} sx={{ position: 'relative' }}>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          sx={{ position: 'absolute', top: 0, left: 0, width: '100%' }}
        >
          <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
            Пользователь создан!
          </Alert>
        </Snackbar>
      </Box>
      <Box mt={5}>
        <Typography variant="h4" align="center" gutterBottom>
          Регистрация
        </Typography>
        <Box
          component="form"
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          noValidate
          autoComplete="off"
          onSubmit={handleRegister}
        >
          <TextField
            label="Логин"
            variant="outlined"
            value={loginValue}
            onChange={(e) => setLoginValue(e.target.value)}
            error={!!loginError}
            helperText={loginError} // Сообщение об ошибке, если логин занят
            fullWidth
          />
          <TextField
            label="Пароль"
            type="password"
            variant="outlined"
            value={passwordValue}
            onChange={(e) => setPasswordValue(e.target.value)}
            error={!!passwordError}
            helperText={passwordError}
            fullWidth
          />
          <TextField
            label="Повторите пароль"
            type="password"
            variant="outlined"
            value={confirmPasswordValue}
            onChange={(e) => setConfirmPasswordValue(e.target.value)}
            error={!!passwordError}
            helperText={passwordError}
            fullWidth
          />
          {registrationError && (
            <Typography color="error" align="center">{registrationError}</Typography>
          )}
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Зарегистрироваться
          </Button>
          <Typography variant="body2" align="center">
            Уже есть аккаунт? <Link to="/">Войдите</Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default RegisterForm;
