import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './login';
import Dashboard from './Protected/Dashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for persisted authentication on app load
  useEffect(() => {
    const storedAuth = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(storedAuth);
  }, []);

  // Function to handle successful login
  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true'); // Persist login state
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated'); // Clear login state
  };

  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route 
          path="/" 
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />
          } 
        />
        
        {/* Dashboard Route */}
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/" replace />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
