// src/components/atoms/Button.jsx
import React from 'react';

// A reusable button component for links
const Button = ({ href, children }) => {
  return (
    <a href={href} className="bg-primary text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-secondary transition-colors duration-300">
      {children}
    </a>
  );
};

export default Button;