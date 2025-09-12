import React from 'react';
import "./ClosableDiv.css"
const CloseableDiv = ({ isOpen, onClose, children }) => {
  return (
    <div className={`closeable-div ${isOpen ? 'open' : 'closed'}`}>
      <button onClick={onClose} className="close-button">
        Close
      </button>
      <div className="content">
        {children}
      </div>
    </div>
  );
};

export default CloseableDiv;
