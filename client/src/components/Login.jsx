import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      onLogin(res.data.user, res.data.token);
    } catch (err) {
      console.error(err);
      if (!err.response) {
        setError('Network error: Unable to reach server. Is the backend running?');
      } else {
        setError(err.response?.data?.message || 'Login failed');
      }
    }
  };

  return (
    <div className="login-screen">
      <div className="login-container">
        <h1>Welcome Back</h1>
        <p>Login to your account</p>
        {error && <div className="error-message" style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        <p style={{marginTop: '20px'}}>
          Don't have an account? <Link to="/register" style={{color: 'var(--primary)'}}>Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
