import React, { useState } from 'react';
import axios from 'axios';
import './login.css';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Reset Password States
  const [resetStep, setResetStep] = useState(1); // Steps: 1-email, 2-code, 3-success
  const [resetEmail, setResetEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);

  // Handle Login
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/login', {
        email,
        password,
      });
      if (response.status === 200) {
        onLogin();
      }
    } catch (err) {
      setError(err.response?.data.message || 'An error occurred. Please try again.');
    }
  };

  // Request Reset Code
  const handleResetRequest = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/request-reset', { email: resetEmail });
      setResetMessage(response.data.message);
      setResetStep(2); // Move to verification step
    } catch (err) {
      setResetMessage(err.response?.data.message || 'Error sending reset email.');
    }
  };

  // Verify Code and Reset Password
  const handleCodeVerification = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/verify-reset-code', {
        email: resetEmail,
        code: verificationCode,
        newPassword,
      });
      setResetMessage(response.data.message);
      setResetStep(3); // Move to success confirmation step
    } catch (err) {
      setResetMessage(err.response?.data.message || 'Invalid code or password reset failed.');
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

      <div className="forgot-password">
        <button onClick={() => setShowResetModal(true)} className="reset-button">
          Forgot Password?
        </button>
      </div>

      {/* Reset Password Modal */}
      {showResetModal && (
        <div className="reset-modal">
          <h3>Reset Password</h3>

          {/* Step 1: Enter Email */}
          {resetStep === 1 && (
            <form onSubmit={handleResetRequest}>
              <label>Enter your email:</label>
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />
              <button type="submit">Send Reset Code</button>
              {resetMessage && <p style={{ color: 'green' }}>{resetMessage}</p>}
            </form>
          )}

          {/* Step 2: Verify Code and Set New Password */}
          {resetStep === 2 && (
            <form onSubmit={handleCodeVerification}>
              <label>Enter Verification Code:</label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
              />
              <label>Enter New Password:</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button type="submit">Reset Password</button>
              {resetMessage && <p style={{ color: 'green' }}>{resetMessage}</p>}
            </form>
          )}

          {/* Step 3: Success Confirmation */}
          {resetStep === 3 && (
            <div>
              <p style={{ color: 'green' }}>Password reset successfully! You can now log in with your new password.</p>
              <button onClick={() => setShowResetModal(false)} className="close-button">
                Close
              </button>
            </div>
          )}

          {/* Close Modal Button */}
          {resetStep !== 3 && (
            <button onClick={() => setShowResetModal(false)} className="close-button">
              Close
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Login;
