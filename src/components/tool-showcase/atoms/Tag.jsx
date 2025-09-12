// src/components/atoms/Tag.js
import React from 'react';

const Tag = ({ children }) => {
  return (
    <span className="inline-block bg-gray-200 text-primary rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2">
      {children}
    </span>
  );
};

export default Tag;