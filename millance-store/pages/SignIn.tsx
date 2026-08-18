// Sign In Page
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import './SignIn.css';

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-page">
      <div className="signin-container">
        <motion.div
          className="signin-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="signin-header">
            <h1 onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Millance</h1>
            <p>Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="signin-form">
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group">
              <label>Email or mobile phone number</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="signin-btn" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="signin-divider">
            <span>New to Millance?</span>
          </div>

          <button className="create-account-btn" onClick={() => navigate('/signup')}>
            Create your Millance account
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default SignIn;
