import React from 'react';
import logoImage from '../assets/images/nipix-logo.png';

/**
 * Official Nipix Brand Logo Component
 * Renders ONLY the isolated glowing "N" logo image without background, borders, or container.
 * Preserves exact aspect ratio and visual footprint.
 */
const NipixLogo = ({
  size = 38,
  width,
  height,
  className = '',
  style = {},
  alt = 'Nipix Logo',
  ...props
}) => {
  const resolvedHeight = height || (typeof size === 'number' ? `${size}px` : size);
  const resolvedWidth = width || (height ? 'auto' : (typeof size === 'number' ? `${Math.round(size * 1.21)}px` : 'auto'));

  const baseStyle = {
    display: 'inline-block',
    objectFit: 'contain',
    height: resolvedHeight,
    width: resolvedWidth,
    maxWidth: '100%',
    verticalAlign: 'middle',
    background: 'transparent',
    border: 'none',
    boxShadow: 'none',
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
