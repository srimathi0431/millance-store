// Sign Up Page
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './SignUp.css';

const SignUp= () => {
 const navigate = useNavigate();
 const [formData, setFormData] = useState({
 name: '',
 email: '',
 phone: '',
 password: '',
 confirmPassword: '',
 });
 const [error, setError] = useState('');
 const [success, setSuccess] = useState(false);

 const handleSubmit = (e) => {
 e.preventDefault();
 setError('');

 if (formData.password !== formData.confirmPassword) {
 setError('Passwords do not match');
 return;
 }

 if (formData.password.length < 6) {
 setError('Password must be at least 6 characters');
 return;
 }

 setSuccess(true);
 setTimeout(() => navigate('/signin'), 2000);
 };

 return (
 <div className="signup-page">
 <div className="signup-container">
 <motion.div
 className="signup-card"
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 >
 <div className="signup-header">
 <h1 onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Millance</h1>
 <p>Create your account</p>
 </div>

 {success ? (
 <div className="success-message">
 Account created successfully Redirecting to sign in...
 </div>
 ) : (
 <form onSubmit={handleSubmit} className="signup-form">
 {error && <div className="error-message">{error}</div>}
 
 <div className="form-group">
 <label>Your name</label>
 <input
 type="text"
 value={formData.name}
 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
 required
 />
 </div>

 <div className="form-group">
 <label>Mobile number or email</label>
 <input
 type="text"
 value={formData.email}
 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
 required
 />
 </div>

 <div className="form-group">
 <label>Password</label>
 <input
 type="password"
 value={formData.password}
 onChange={(e) => setFormData({ ...formData, password: e.target.value })}
 required
 placeholder="At least 6 characters"
 />
 </div>

 <div className="form-group">
 <label>Re-enter password</label>
 <input
 type="password"
 value={formData.confirmPassword}
 onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
 required
 />
 </div>

 <button type="submit" className="signup-btn">
 Create your Millance account
 </button>
 </form>
 )}

 <div className="signup-footer">
 Already have an account?{' '}
 <button onClick={() => navigate('/signin')} className="link-btn">
 Sign in
 </button>
 </div>
 </motion.div>
 </div>
 </div>
 );
};

export default SignUp;
