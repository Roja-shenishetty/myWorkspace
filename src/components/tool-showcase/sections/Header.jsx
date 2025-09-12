// src/components/Header.js
import React from 'react';

const Header = () => {
  return (
    <header className="bg-white text-center py-24 px-6">
      <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4">
        A Suite of Tools to Supercharge Your Learning Workflow
      </h1>
      <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
        Handcrafted, utilities designed to solve common development problems, so you can focus on what matters: Learning & building.
      </p>
      <a href="#toolbelt" className="bg-primary text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-secondary transition-colors duration-300">
        Explore All Tools
      </a>
    </header>
  );
};

export default Header;