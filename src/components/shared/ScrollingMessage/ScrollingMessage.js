import React from 'react';
import './ScrollingMessage.css'; // Import CSS file for styling

const ScrollingMessage = ({message="Click here to upload new"}) => {
  return (
    <div className="scrolling-message-container">
      <marquee behavior="scroll" direction="left" className="scrolling-message">
       {message}
      </marquee>
    </div>
  );
};

export default ScrollingMessage;
