import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './login';
import Register from './Register'; // Register Component
import Dashboard from './Protected/Dashboard';
import './App.css';

// Home Component
const Home = () => {
  return (
    <div className="home-container">
      <h1>Welcome to Our App</h1>
      <p>Please log in or register to continue.</p>
      <div>
        <Link to="/login">
          <button className="home-button">Login</button>
        </Link>
        <Link to="/register">
          <button className="home-button">Register</button>
        </Link>
      </div>
    </div>
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check persisted authentication on app load
  useEffect(() => {
    const storedAuth = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(storedAuth);
  }, []);

  // Handle login
  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  };

  return (
    <Router>
      <Routes>
        {/* Home Route */}
        <Route 
          path="/" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Home />} 
        />

        {/* Login Route */}
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />}
        />

        {/* Register Route */}
        <Route 
          path="/register" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />}
        />

        {/* Dashboard Route */}
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/" replace />}
        />

        {/* Catch-all Route: Redirect to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
