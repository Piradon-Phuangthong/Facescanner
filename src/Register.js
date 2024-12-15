import React, { useState } from 'react';
import axios from 'axios';
import './login.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState(1);
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/register', { email, password });
      setMessage(response.data.message);
      setStep(2); // Proceed to the verification step
    } catch (err) {
      setMessage(err.response?.data?.message || 'Registration failed.');
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/verify-email', { email, code });
      setMessage(response.data.message);
      setStep(3); // Success step
    } catch (err) {
      setMessage(err.response?.data?.message || 'Verification failed.');
    }
  };

  return (
    <div className='login-container'>
      {step === 1 && (
        <form onSubmit={handleRegister}>
            <div className="form-group">
                <h2>Register</h2>
                <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                />
            </div>
          
          <br />
          <div className='form-group'>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          </div>
          <br />
          <button type="submit">Register</button>
          <p>{message}</p>
        </form>
      )}

      {step === 2 && (
        
        <form onSubmit={handleVerify}>
            <div className="form-group">
          <h2>Email Verification</h2>
          <input
            type="text"
            placeholder="Enter Verification Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          <br />
          </div>
          <button type="submit">Verify</button>
          <p>{message}</p>
          
        </form>
        
      )}

      {step === 3 && (
        <div className='form-group'>
          <h2>Registration Complete!</h2>
          <p>{message}</p>
          <a href="/">Go to Home</a>
        </div>
      )}
    </div>
  );
};

export default Register;
