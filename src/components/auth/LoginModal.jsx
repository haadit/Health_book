import React, { useState } from 'react';
import { authAPI } from '../../services/api';
import '../../styles/Modal.css';

function LoginModal({ onClose, onSwitch, onLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Validate input
      if (!formData.email || !formData.password) {
        setError('Email and password are required');
        return;
      }

      // Log the exact data being sent
      console.log('Submitting login with:', {
        email: formData.email,
        password: formData.password,
        passwordType: typeof formData.password,
        passwordLength: formData.password.length
      });

      const response = await authAPI.login({
        email: formData.email,
        password: formData.password
      });

      if (!response.data || !response.data.token || !response.data.user) {
        throw new Error('Invalid response from server');
      }

      // Call onLogin with user data
      onLogin(response.data.user);
      onClose();

    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Login</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>
          <div className="modal-buttons">
            <button 
              type="submit" 
              className="primary"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
            <button 
              type="button" 
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </form>
        <p>
          Don't have an account?{' '}
          <button 
            className="link-button" 
            onClick={() => onSwitch('signup')}
            disabled={isLoading}
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginModal; 