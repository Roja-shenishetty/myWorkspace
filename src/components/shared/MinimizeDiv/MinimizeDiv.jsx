import React, { useState } from 'react';
import './MinimizeDiv.css';

const MinimizeDiv = () => {
  const [isMinimized, setIsMinimized] = useState(false);

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className={`container ${isMinimized ? 'minimized' : ''}`}>
      <div className="left-div">
        Left Side Content
      </div>
      <div className="right-div">
        <button onClick={toggleMinimize}>Toggle Minimize</button>
        Right Side Content
      </div>
    </div>
  );
};

export default MinimizeDiv;
