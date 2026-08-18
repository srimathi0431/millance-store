import React from 'react';
import './WhatsAppButton.css';

const WhatsAppButton: React.FC = () => {
  const handleWhatsAppClick = () => {
    // Replace with your WhatsApp number
    const phoneNumber = '919876543210'; // Format: country code + number (no spaces or special chars)
    const message = 'Hello! I need help with Millance Store';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <button 
      className="whatsapp-float-button" 
      onClick={handleWhatsAppClick}
      aria-label="Chat on WhatsApp"
    >
      <svg 
        viewBox="0 0 32 32" 
        className="whatsapp-icon"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          fill="currentColor" 
          d="M16 0c-8.837 0-16 7.163-16 16 0 2.825 0.737 5.607 2.137 8.048l-2.137 7.952 7.933-2.127c2.42 1.37 5.173 2.127 8.067 2.127 8.837 0 16-7.163 16-16s-7.163-16-16-16zM16 29.467c-2.482 0-4.908-0.646-7.07-1.87l-0.507-0.292-4.713 1.262 1.262-4.669-0.292-0.508c-1.207-2.100-1.847-4.507-1.847-6.976 0-7.51 6.11-13.621 13.621-13.621 7.51 0 13.621 6.11 13.621 13.621s-6.557 13.053-14.075 13.053zM21.305 19.26c-0.346-0.174-2.049-1.007-2.366-1.123-0.316-0.117-0.547-0.174-0.776 0.174s-0.893 1.123-1.094 1.347c-0.201 0.224-0.402 0.251-0.748 0.076-0.346-0.174-1.461-0.539-2.785-1.722-1.031-0.922-1.727-2.061-1.929-2.407-0.201-0.346-0.022-0.533 0.152-0.707 0.156-0.155 0.346-0.402 0.518-0.603 0.174-0.201 0.231-0.346 0.346-0.571 0.117-0.224 0.058-0.427-0.028-0.603s-0.776-1.87-1.063-2.565c-0.28-0.672-0.56-0.58-0.776-0.591-0.201-0.008-0.428-0.010-0.656-0.010s-0.603 0.085-0.92 0.427c-0.316 0.346-1.206 1.179-1.206 2.873s1.235 3.333 1.406 3.561c0.174 0.224 2.425 3.732 5.872 5.234 0.821 0.354 1.462 0.566 1.962 0.724 0.824 0.262 1.574 0.225 2.168 0.137 0.661-0.099 2.049-0.835 2.335-1.642 0.288-0.807 0.288-1.501 0.201-1.642-0.086-0.14-0.315-0.224-0.662-0.398z"
        />
      </svg>
      <span className="whatsapp-pulse"></span>
    </button>
  );
};

export default WhatsAppButton;
