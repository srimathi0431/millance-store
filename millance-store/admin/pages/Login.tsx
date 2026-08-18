import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import '../styles/admin.css';

const LoginPage: React.FC = () => {
  const { login, isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@millance.store');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (isAuthenticated) navigate('/admin/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) { setError('Email and password are required.'); return; }
    setLoading(true); setError('');
    try {
      await login(email, password);
      navigate('/admin/dashboard', { replace: true });
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.response?.data?.detail || 'Invalid email or password.';
      setError(msg);
    } finally { setLoading(false); }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-logo">
          <div className="admin-login-logo-icon">M</div>
          <h1>Millance Store</h1>
          <span>Admin Portal</span>
        </div>

        {error && (
          <div className="admin-login-error">
            <AlertCircle size={15} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label className="admin-form-label">Email Address</label>
            <input
              className="admin-form-input"
              type="email"
              placeholder="admin@millance.store"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                className="admin-form-input"
                type={showPw ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                style={{ paddingRight: 42 }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPw(p => !p)}
                style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#94A3B8', padding:0, display:'flex' }}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className="admin-login-submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In to Admin Panel'}
          </button>
        </form>

        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <a href="/portal" style={{ fontSize: 13, color: '#64748B', textDecoration: 'none' }}>
            ← Back to Portal Selection
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
