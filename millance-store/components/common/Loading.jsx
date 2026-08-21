import React from 'react';
import './Loading.css';

const Loading= ({ fullScreen = false, message = 'Loading...' }) => {
 if (fullScreen) {
 return (
 <div className="loading-fullscreen">
 <div className="loading-content">
 <div className="spinner-large"></div>
 <p className="loading-message">{message}</p>
 </div>
 </div>
 );
 }

 return (
 <div className="loading-inline">
 <div className="spinner"></div>
 <span>{message}</span>
 </div>
 );
};

export default Loading;
