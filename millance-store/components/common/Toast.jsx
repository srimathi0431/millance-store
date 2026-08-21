import React, { useEffect, useState } from 'react';
import { CheckCircle, X } from 'lucide-react';
import './Toast.css';

const Toast= ({ message, type = 'success', duration = 3000, onClose }) => {
 const [isVisible, setIsVisible] = useState(true);

 useEffect(() => {
 const timer = setTimeout(() => {
 setIsVisible(false);
 setTimeout(onClose, 300);
 }, duration);

 return () => clearTimeout(timer);
 }, [duration, onClose]);

 return (
 <div className={`toast-notification ${type} ${isVisible ? 'show' : 'hide'}`}>
 <CheckCircle size={20} className="toast-icon" />
 <span className="toast-message">{message}</span>
 <button className="toast-close" onClick={() => {
 setIsVisible(false);
 setTimeout(onClose, 300);
 }}>
 <X size={16} />
 </button>
 </div>
 );
};

export default Toast;
