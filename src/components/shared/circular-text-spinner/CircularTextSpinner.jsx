'use client'
import React from 'react'
import defaultIcon from './h2-logo.jpg' // must exist in the same folder or use public path

const CircularTextSpinner = ({
  text = '* iLearn - Your AI Companion for learning * Free Learning Hub',
  textRepeat = 1,
  iconSrc = defaultIcon,
  size = 200,
  textColor = '#101010',
  fontSize = 16,
  fontFamily = 'sans-serif',
  spinDuration = 16,
  reverse = false,
  pauseOnHover = true,
  logoZoom = text ? 0.55 : 0.8 ,// if no text, show bigger logo
}) => {
  const radius = size / 2 - 25
  const circlePathId = `circlePath-${Math.random().toString(36).substring(2, 9)}`
  const repeatedText = Array(textRepeat).fill(text).join(' • ')

  const containerStyle = {
    width: size,
    height: size,
    backgroundColor: '#fff',
    borderRadius: '50%',
    boxShadow: '0 22px 54px rgba(12, 12, 12, 0.26)',
    position: 'relative',
    overflow: 'hidden'
  }

  const logoSize = size * logoZoom

  const logoStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: logoSize,
    height: logoSize,
    transform: 'translate(-50%, -50%)',
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }

  const logoImgStyle = {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
  }


  const textStyle = {
    zIndex: 2,
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    animation: `spin ${spinDuration}s linear infinite`,
    transformOrigin: 'center center',
    animationDirection: reverse ? 'reverse' : 'normal',
  }

  return (
    <div
      style={containerStyle}
      className={pauseOnHover ? 'pause-on-hover-container' : ''}
    >
      <div style={logoStyle}>
        <img
          src={typeof iconSrc === 'string' ? iconSrc : iconSrc.src}
          alt="Logo"
          style={logoImgStyle}
        />
      </div>
      <div style={textStyle} className="spinner-text">
        <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
          <defs>
            <path
              id={circlePathId}
              d={`M ${size / 2}, ${size / 2} m -${radius}, 0
                  a ${radius},${radius} 0 1,0 ${radius * 2},0
                  a ${radius},${radius} 0 1,0 -${radius * 2},0`}
            />
          </defs>
          <text
            fill={textColor}
            fontSize={fontSize}
            fontFamily={fontFamily}
            fontWeight="bold"
            dominantBaseline="middle"
          >
            <textPath
              href={`#${circlePathId}`}
              startOffset="50%"
              textAnchor="middle"
            >
              {repeatedText}
            </textPath>
          </text>
        </svg>
      </div>

      <style>
        {`
          @keyframes spin {
            100% {
              transform: rotate(360deg);
            }
          }

          .pause-on-hover-container:hover .spinner-text {
            animation-play-state: paused !important;
          }
        `}
      </style>
    </div>
  )
}

export default CircularTextSpinner
