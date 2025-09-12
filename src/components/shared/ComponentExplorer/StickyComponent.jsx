import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './StickyComponent.css';

const StickyComponent = ({
  parentId,
  childId,
  mode = 'css-sticky', // 'scroll-follow' or 'css-sticky'
  position = 'top', // 'top', 'bottom', 'center', 'center-left', 'center-right'
  offset = 0,
  children,
  minimizable = false,
  fab = false,
  initialMinimized = false
}) => {
  const [minimized, setMinimized] = useState(initialMinimized);

  useEffect(() => {
    if (mode !== 'scroll-follow') return;

    const parent = document.getElementById(parentId);
    const child = document.getElementById(childId);

    if (!parent || !child) {
      console.warn('StickyComponent: parent or child element not found');
      return;
    }

    const handleScroll = () => {
      const scrollY = parent.scrollTop;
      child.style.transform = `translateY(${scrollY + offset}px)`;
    };

    handleScroll();

    parent.addEventListener('scroll', handleScroll);
    return () => {
      parent.removeEventListener('scroll', handleScroll);
      child.style.transform = '';
    };
  }, [parentId, childId, mode, offset]);

  const toggleMinimize = () => setMinimized(!minimized);

  if (mode === 'scroll-follow') {
    return <div id={childId}>{children}</div>;
  }

  return (
    <div
      className={`sticky-component css-sticky ${position} ${fab && minimized ? 'fab-mode' : ''}`}
    >
      {minimizable && minimized ? (
        <button
          className="fab-button"
          onClick={toggleMinimize}
          aria-label="Expand sticky component"
        >
          +
        </button>
      ) : (
        <div className="sticky-content">
          {minimizable && (
            <button
              className="minimize-btn"
              onClick={toggleMinimize}
              aria-label="Minimize sticky component"
            >
              −
            </button>
          )}
          {children}
        </div>
      )}
    </div>
  );
};

StickyComponent.propTypes = {
  parentId: PropTypes.string,
  childId: PropTypes.string,
  mode: PropTypes.oneOf(['scroll-follow', 'css-sticky']),
  position: PropTypes.oneOf(['top', 'bottom', 'center', 'center-left', 'center-right']),
  offset: PropTypes.number,
  children: PropTypes.node,
  minimizable: PropTypes.bool,
  fab: PropTypes.bool,
  initialMinimized: PropTypes.bool
};

export default StickyComponent;
