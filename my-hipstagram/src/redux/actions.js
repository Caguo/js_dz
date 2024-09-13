import { jwtDecode } from 'jwt-decode';
import { authApi } from './authApiSlice';
import { userAboutApi } from './userAbout';  // Обновите импорт
import { setCredentials, setUserInfo } from './authSlice';

export const actionFullLogin = (login, password) => async (dispatch) => {
  try {
    const { data } = await dispatch(authApi.endpoints.login.initiate({ login, password }));
    console.log('Token result:', data);

    if (data && data.login) {
      const token = String(data.login);
      console.log('Token:', token);

      const decodedToken = jwtDecode(token);
      console.log('Decoded Token:', decodedToken);

      const userId = decodedToken.sub;

      dispatch(setCredentials({ token }));

      const userResult = await dispatch(userAboutApi.endpoints.getUserById.initiate(userId)); // Обновите здесь
      const userInfo = userResult?.data; // Убедитесь, что используете правильное поле

      if (userInfo) {
        dispatch(setUserInfo(userInfo));
      } else {
        console.error('Не удалось получить данные пользователя');
      }
    } else {
      console.error('Ошибка авторизации: Неправильный формат данных');
    }
  } catch (error) {
    console.error('Ошибка авторизации:', error);
  }
};

export const actionAboutMe = () => async (dispatch, getState) => {
  const { auth } = getState();

  if (auth.token) {
    try {
      const decodedToken = jwtDecode(auth.token);
      const userId = decodedToken.sub.id;

      if (userId) {
        const userResult = await dispatch(userAboutApi.endpoints.getUserById.initiate(userId)); // Обновите здесь
        const userInfo = userResult?.data;

        if (userInfo) {
          dispatch(setUserInfo(userInfo));
        } else {
          console.error('Не удалось получить данные пользователя');
        }
      } else {
        console.error('Анонимный пользователь не имеет идентификатора');
      }
    } catch (error) {
      console.error('Ошибка получения данных о пользователе:', error);
    }
  } else {
    console.error('Нет токена для аутентификации');
  }
};
