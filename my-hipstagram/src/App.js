// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import store from './redux/store'; 
import LoginForm from './pages/LoginForm';
import MainPage from './pages/MainPage';
import RegisterForm from './components/RegisterForm';
import MyProfilePage from './pages/MyProfilePage';
import UserProfilePage from './pages/userProfilePage';

const AppRoutes = () => {
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
      <Router>
        <AppRoutes />
      </Router>
    </Provider>
  );
};

export default App;
