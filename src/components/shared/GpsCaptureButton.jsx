import { useState } from 'react';
import { Button, CircularProgress, Snackbar, Alert } from '@mui/material';

export default function GpsCaptureButton({ onCapture }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getUserLocation = () => {
    setLoading(true);
    setError('');

    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const gps = {
          latitude,
          longitude,
          captured_at: new Date().toISOString()
        };
       if(onCapture) {onCapture(gps) } else {
          console.log("OnCapture handler expected for component is missing."),
          setError("OnCaputure handler expected for component is missing.");
        }
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <>
      <Button variant="outlined" size="small" onClick={getUserLocation} disabled={loading}>
        {loading ? <CircularProgress size={18} /> : '📍 Capture Location'}
      </Button>
      <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError('')}>
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
}