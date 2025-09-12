import React from 'react';
import {Audio, Img, useCurrentFrame, interpolate, staticFile} from 'remotion';

export const Scene = ({
  id,
  duration,
  image,
  background,
  text,
  voiceover,
  animation,
  caption_position = 'bottom',
  fps,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15], [0, 1]);

  const captionStyle = {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    bottom: caption_position === 'bottom' ? 100 : undefined,
    top: caption_position === 'top' ? 100 : undefined,
    transform: caption_position === 'center' ? 'translateY(0)' : undefined,
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
    padding: '0 40px',
  };

  return (
    <div style={{width: '100%', height: '100%'}}>
      {image && (
        <Img
          src={staticFile(`assets/${image}`)}
          style={{width: '100%', height: '100%', objectFit: 'cover'}}
        />
      )}
      {background && (
        <div
          style={{backgroundColor: background, width: '100%', height: '100%'}}
        />
      )}
      <div style={{...captionStyle, opacity, whiteSpace: 'pre-line'}}>{text}</div>
      {voiceover && (
        <Audio
          src={staticFile(`assets/${voiceover}`)}
          volume={() => 1}
        />
      )}
    </div>
  );
};
