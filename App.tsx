
import React, { useState, useCallback } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DetectionPage from './pages/DetectionPage';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = useCallback(() => {
    setIsAuthenticated(true);
  }, []);

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
  }, []);

  return (
    <HashRouter>
      <Routes>
        <Route 
          path="/login" 
          element={
            !isAuthenticated ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/app" />
          } 
        />
        <Route 
          path="/app" 
          element={
            isAuthenticated ? <DetectionPage onLogout={handleLogout} /> : <Navigate to="/login" />
          } 
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
