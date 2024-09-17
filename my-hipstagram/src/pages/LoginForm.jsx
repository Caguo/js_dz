import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, Snackbar, Alert } from '@mui/material'; // Импортируйте Snackbar и Alert
import { actionFullLogin, actionAboutMe } from '../redux/actions';

const LoginForm = () => {
  const [loginValue, setLoginValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [formError, setFormError] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false); // Для управления отображением Snackbar
  const [errorMessage, setErrorMessage] = useState(''); // Сообщение об ошибке

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError(false);
    setOpenSnackbar(false); // Закрываем Snackbar при новой попытке

    try {
      const result = await dispatch(actionFullLogin(loginValue, passwordValue));
      if (result.error) {
        setErrorMessage(result.error);
        setOpenSnackbar(true);
        return;
      }

      await dispatch(actionAboutMe()); // Запрашиваем данные о пользователе после входа
      navigate('/main');
    } catch (err) {
      setErrorMessage('Не удалось авторизоваться. Попробуйте еще раз.');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
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
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          message={errorMessage}
        >
          <Alert onClose={handleCloseSnackbar} severity="error">
            {errorMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default LoginForm;
