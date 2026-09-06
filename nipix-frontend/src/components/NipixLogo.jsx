import React from 'react';
import logoImage from '../assets/images/nipix-logo.png';

/**
 * Official Nipix Brand Logo Component
 * Uses the official glowing futuristic brand logo asset.
 * Maintains exact aspect ratio, no stretching or distortion (object-fit: contain).
 */
const NipixLogo = ({
  size = 40,
  width,
  height,
  className = '',
  style = {},
  alt = 'Nipix Logo',
  glow = false,
  variant = 'icon',
  ...props
}) => {
  const resolvedWidth = width || (variant === 'full' ? '180px' : (typeof size === 'number' ? `${size}px` : size));
  const resolvedHeight = height || (variant === 'full' ? 'auto' : (typeof size === 'number' ? `${size}px` : size));

  const baseStyle = {
    display: 'inline-block',
    objectFit: 'contain',
    width: resolvedWidth,
    height: resolvedHeight,
    maxWidth: '100%',
    verticalAlign: 'middle',
    borderRadius: style.borderRadius || (variant === 'full' ? '12px' : '10px'),
    boxShadow: glow ? '0 0 20px rgba(59, 130, 246, 0.45)' : undefined,
    userSelect: 'none',
    ...style
  };

  return (
    <img
      src={logoImage}
      alt={alt}
      className={`nipix-brand-logo ${className}`.trim()}
      style={baseStyle}
      loading="eager"
      onError={(e) => {
        const publicFallback = `${process.env.PUBLIC_URL || ''}/assets/nipix-logo.png`;
        if (e.currentTarget.src !== publicFallback) {
          e.currentTarget.src = publicFallback;
        }
      }}
      {...props}
    />
  );
};

export default NipixLogo;
