// ═══════════════════════════════════════════════════════════════════
// OPTIMIZED IMAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════
// Ensures all images load correctly with automatic fallbacks
// Lazy loading + error handling + responsive
// ═══════════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { getImageWithFallbacks } from '@/utils/imageUtils';

export const OptimizedImage= ({
 src,
 alt,
 className = '',
 productName = '',
 loading = 'lazy',
 objectFit = 'cover',
}) => {
 const fallbacks = getImageWithFallbacks(productName, src);
 const [currentIndex, setCurrentIndex] = useState(0);
 const [imageLoaded, setImageLoaded] = useState(false);

 const handleError = () => {
 if (currentIndex < fallbacks.length - 1) {
 setCurrentIndex(currentIndex + 1);
 }
 };

 const handleLoad = () => {
 setImageLoaded(true);
 };

 return (
 <div className={`optimized-image-wrapper ${className}`} style={{ position: 'relative', overflow: 'hidden' }}>
 {!imageLoaded && (
 <div 
 style={{
 position: 'absolute',
 inset: 0,
 background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
 animation: 'pulse 1.5s ease-in-out infinite',
 }}
 />
 )}
 <img
 src={fallbacks[currentIndex]}
 alt={alt}
 loading={loading}
 onError={handleError}
 onLoad={handleLoad}
 crossOrigin="anonymous"
 style={{
 width: '100%',
 height: '100%',
 objectFit: objectFit,
 opacity: imageLoaded ? 1 : 0,
 transition: 'opacity 0.3s ease',
 }}
 />
 </div>
 );
};

export default OptimizedImage;
