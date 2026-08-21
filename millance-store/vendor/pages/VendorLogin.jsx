import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useVendorAuth } from '../contexts/VendorAuthContext';
import '../styles/vendor.css';

const VendorLogin= () => {
 const { login, isAuthenticated } = useVendorAuth();
 const navigate = useNavigate();
 const [email, setEmail] = useState('vendor@millance.gold');
 const [password, setPassword] = useState('');
 const [showPw, setShowPw] = useState(false);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState('');

 React.useEffect(() => {
 if (isAuthenticated) navigate('/vendor/dashboard', { replace: true });
 }, [isAuthenticated, navigate]);

 const handleSubmit = async (e) => {
 e.preventDefault();
 if (!email.trim() || !password.trim()) { setError('Email and password are required.'); return; }
 setLoading(true); setError('');
 try {
 await login(email, password);
 navigate('/vendor/dashboard', { replace: true });
 } catch (err) {
 setError(err?.response?.data?.message || err?.response?.data?.detail || 'Invalid email or password.');
 } finally { setLoading(false); }
 };

 return (
 <div className="vendor-login-page">
 <div className="vendor-login-card">
 <div className="vendor-login-logo">
 <div className="vendor-login-logo-icon">M</div>
 <h1>Millance Store</h1>
 <span>Vendor Portal</span>
 </div>

 {error && (
 <div className="vendor-login-error">
 <AlertCircle size={15} />{error}
 </div>
 )}

 <form onSubmit={handleSubmit}>
 <div className="vendor-form-group">
 <label className="vendor-form-label">Email Address</label>
 <input className="vendor-form-input" type="email" value={email}
 onChange={e => setEmail(e.target.value)} autoComplete="email" required />
 </div>
 <div className="vendor-form-group">
 <label className="vendor-form-label">Password</label>
 <div style={{ position: 'relative' }}>
 <input className="vendor-form-input" type={showPw ? 'text' : 'password'}
 value={password} onChange={e => setPassword(e.target.value)}
 style={{ paddingRight: 42 }} autoComplete="current-password" required />
 <button type="button" onClick={() => setShowPw(p => !p)}
 style={{ position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'#94A3B8',display:'flex' }}>
 {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
 </button>
 </div>
 </div>
 <button type="submit" className="vendor-login-submit" disabled={loading}>
 {loading ? 'Signing in...' : 'Sign In to Vendor Panel'}
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

export default VendorLogin;
