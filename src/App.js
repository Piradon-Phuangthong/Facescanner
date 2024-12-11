import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './login';
import Dashboard from './Protected/Dashboard';

function App() {
  const [isAuthenticated, setIsAuthenicated] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login onLogin={() => setIsAuthenicated(true)} />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard/> : <Navigate to = "/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
