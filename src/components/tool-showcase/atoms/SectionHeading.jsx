// src/components/atoms/SectionHeading.js
import React from 'react';

const SectionHeading = ({ children }) => {
  return (
    <h2 className="text-3xl md:text-4xl font-bold text-primary mb-12">
      {children}
    </h2>
  );
};

export default SectionHeading;