import React from 'react';
import secretWandPng from '../../assets/icons/secret-wand.png';

const SecretWandIcon = ({ onClick, title = "Open Secret / Hidden Chat", className = "" }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`secret-wand-btn ${className}`}
      title={title}
      aria-label="Secret / Hidden Chat"
    >
      <img
        src={secretWandPng}
        alt="Secret Vault"
        className="secret-wand-img"
      />
    </button>
  );
};

export default SecretWandIcon;
