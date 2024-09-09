import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux'; // Добавьте import useSelector здесь
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './redux/store';
import LoginForm from './pages/LoginForm';
import MainPage from './pages/MainPage';
import RegisterForm from './components/RegisterForm';
import MyProfilePage from './pages/MyProfilePage';
import UserProfilePage from './pages/userProfilePage';

const AppRoutes = () => {
  // Получаем токен из Redux store
  const token = useSelector((state) => state.auth.token);

  return (
    <Routes>
      <Route path="/" element={!token ? <LoginForm /> : <Navigate to="/main" />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/main" element={token ? <MainPage /> : <Navigate to="/" />} />
      <Route path="/myProfile" element={token ? <MyProfilePage /> : <Navigate to="/main" />} />
      <Route path="/profile/:login" element={<UserProfilePage />} />
    </Routes>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <AppRoutes />
        </Router>
      </PersistGate>
    </Provider>
  );
};

export default App;