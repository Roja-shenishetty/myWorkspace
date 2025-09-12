import React from 'react';

const TerminalPlayIcon = (props) => {
  return (
    <svg 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      role="img" 
      aria-label="Terminal Play" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect x="3" y="4" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"></rect>
      {/* window dots */}
      <circle cx="6.5" cy="7.5" r="0.8" fill="currentColor"></circle>
      <circle cx="9" cy="7.5" r="0.8" fill="currentColor"></circle>
      <circle cx="11.5" cy="7.5" r="0.8" fill="currentColor"></circle>
      {/* prompt & cursor */}
      <path d="M6.75 12l3 2-3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
      <path d="M11.5 15h3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
      {/* play button */}
      <circle cx="18.5" cy="15.5" r="3.25" stroke="currentColor" strokeWidth="1.5"></circle>
      <path d="M17.6 13.9l2.4 1.6-2.4 1.6V13.9z" fill="currentColor"></path>
      <title>Terminal Play</title>
    </svg>
  );
};

export default TerminalPlayIcon;