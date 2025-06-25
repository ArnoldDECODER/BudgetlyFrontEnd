import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LOgin from '../Components/auth/LOgin';
import Signup from '../Components/auth/Signup';
import OtpVerify from '../Components/auth/OtpVerify';

const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<LOgin />} />
      <Route path="signup" element={<Signup />} />
      <Route path="verify-otp" element={<OtpVerify />} />
    </Routes>
  );
};

export default AuthRoutes;