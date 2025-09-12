import React, { useState } from 'react';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import './MobileView.css';

const breakpoints = [
  { value: 0, label: 'xs', width: 360 },
  { value: 1, label: 'sm', width: 600 },
  { value: 2, label: 'md', width: 960 },
  { value: 3, label: 'lg', width: 1280 },
  { value: 4, label: 'xl', width: 1920 },
];


export function ResponsiveWidthSlider({ width = 320, onChange }) {
  const minWidth = 320;
  const maxWidth = 1920;

  // Find closest breakpoint label for display
  const closestBp = breakpoints.reduce((prev, curr) => {
    console.log('Comparing:', curr, prev);
    return (
      Math.abs(curr.width - width) < Math.abs(prev.width - width) ? curr : prev
    );

  });

  console.log('Current width:', width);
  console.log('Nearest breakpoint:', closestBp.label, closestBp.value);

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Typography gutterBottom>Adjust Preview Width</Typography>
      <Slider
        min={minWidth}
        max={maxWidth}
        step={1}
        value={width}
        onChange={(_, v) => onChange(v)}
        marks={breakpoints}
        valueLabelDisplay="auto"
        sx={{ mb: 2 }}
      />
      <Typography align="center">
        Width: {width}px &mdash; Nearest breakpoint: {closestBp.label.toUpperCase()} ({closestBp.width}px)
      </Typography>
    </Box>
  );
}


function MobileDevicePreview({
  url = "http://localhost:5173",
  width = 360,
  initialMode = "android"
}) {
  const [mode, setMode] = useState(initialMode);

  return (
    <Box sx={{ maxWidth: 850, mx: 'auto', mt: 4 }}>
      {/* Device mode toggle outside the actual device frame */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <div className="docs-demo-mode-toggle">
          <button
            className={mode === "ios" ? "is-selected" : ""}
            title="Toggle iOS mode"
            onClick={() => setMode("ios")}
          >
            iOS
          </button>
          <button
            className={mode === "android" ? "is-selected" : ""}
            title="Toggle Android mode"
            onClick={() => setMode("android")}
          >
            Android
          </button>
        </div>
      </Box>
      {/* Device Frame */}
      <div
        className={`docs-demo-device ${mode}`}
        style={{
          width,
          height: 704,
          margin: '0 auto',
          background: '#1a1a1a',
          borderRadius: mode === 'android' ? 38 : 62,
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          transition: 'width 0.35s, border-radius 0.35s',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <figure style={{
          width: '100%',
          height: '100%',
          margin: 0,
          position: 'relative',
          background: '#222',
          borderRadius: 'inherit',
          overflow: 'hidden'
        }}>
          {mode === "android" ? (
            <svg className="docs-demo-device__md-bar" viewBox="0 0 1384.3 40.3"
              style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 150, zIndex: 2 }}>
              <path className="st0" d="M1343 5l18.8 32.3c.8 1.3 2.7 1.3 3.5 0L1384 5c.8-1.3-.2-3-1.7-3h-37.6c-1.5 0-2.5 1.7-1.7 3z"></path>
              <circle className="st0" cx="1299" cy="20.2" r="20"></circle>
              <path className="st0" d="M1213 1.2h30c2.2 0 4 1.8 4 4v30c0 2.2-1.8 4-4 4h-30c-2.2 0-4-1.8-4-4v-30c0-2.3 1.8-4 4-4zM16 4.2h64c8.8 0 16 7.2 16 16s-7.2 16-16 16H16c-8.8 0-16-7.2-16-16s7.2-16 16-16z"></path>
            </svg>
          ) : (
            <svg className="docs-demo-device__ios-notch" viewBox="0 0 219 31"
              style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 150, zIndex: 2 }}>
              <path d="M0 1V0h219v1a5 5 0 0 0-5 5v3c0 12.15-9.85 22-22 22H27C14.85 31 5 21.15 5 9V6a5 5 0 0 0-5-5z" fill="#090a0d" fillRule="evenodd" />
            </svg>
          )}
          <iframe
            src={url}
            title="Mobile view preview"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              borderRadius: mode === 'android' ? 38 : 62,
              background: '#fff',
              position: 'relative',
              zIndex: 1,
              transition: 'border-radius 0.35s',
            }}
          />
        </figure>
      </div>
    </Box>
  );
}

const MobileView = ({
  url = "http://localhost:5173",
  initialMode = "android", // can be "android" or "ios"
}) => {
  const [mode, setMode] = useState(initialMode);
  const [width, setWidth] = useState(360);
  return (
    <div className="doc-demo">
      <ResponsiveWidthSlider width={width} onChange={setWidth} />
      <MobileDevicePreview url={url} width={width} />
    </div>
  );
};

export default MobileView;
