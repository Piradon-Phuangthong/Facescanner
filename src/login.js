import React, { useState } from 'react';
import axios from 'axios'; // Import axios for making API requests
import './login.css'; // Optional CSS file for styling

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Send a POST request to the login route
      const response = await axios.post('http://localhost:5001/login', {
        email,
        password,
      });
  
      if (response.status === 200) {
        console.log("Login successful, redirecting to dashboard...");
        onLogin(); // Call the function passed from App to set authentication
        
        
      } 
    } catch (err) {
      // Handle errors from the server
      if (err.response && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };
  

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

export default Login;
