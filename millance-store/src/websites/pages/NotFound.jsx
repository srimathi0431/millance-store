import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import './NotFound.css';

const NotFound= () => {
 const navigate = useNavigate();

 return (
 <div className="not-found-page">
 <div className="container">
 <div className="not-found-content">
 <h1 className="error-code">404</h1>
 <h2 className="error-title">Page Not Found</h2>
 <p className="error-description">
 The page you're looking for doesn't exist or has been moved.
 </p>
 <div className="error-actions">
 <button className="btn btn-accent" onClick={() => navigate('/')}>
 <Home size={20} />
 <span>Go to Home</span>
 </button>
 <button className="btn btn-outline" onClick={() => navigate(-1)}>
 Go Back
 </button>
 </div>
 </div>
 </div>
 </div>
 );
};

export default NotFound;
