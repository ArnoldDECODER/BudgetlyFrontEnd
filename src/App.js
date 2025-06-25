import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './Components/Layout/Navbar';

import AuthRoutes from './pages/AuthRoutes';
import ProtectedRoute from './pages/ProtectedRoutes';

import HomePage from './Components/dashboard/Homepage';
import Transactions from './Components/dashboard/Transactions';
import Goals from './Components/dashboard/Goals';
import Analytics from './Components/dashboard/Analytics';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Auth Routes - Use exact path without wildcard */}
        <Route path="/auth/*" element={<AuthRoutes />} />

        {/* Protected Layout + Routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <>
                <Header />
                <HomePage />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <>
                <Header />
                <Transactions />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/goals"
          element={
            <ProtectedRoute>
              <>
                <Header />
                <Goals />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <>
                <Header />
                <Analytics />
              </>
            </ProtectedRoute>
          }
        />

        {/* Redirect unknown paths */}
        <Route path="/" element={<Navigate to="/auth/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;