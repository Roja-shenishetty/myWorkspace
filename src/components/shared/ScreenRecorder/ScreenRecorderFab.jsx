import React, { useState, useEffect, useRef } from 'react';
import { Fab, Paper, Button, Checkbox, FormControlLabel, Modal, Box, Typography, Slide,Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';

// --- MUI Icons ---
import VideocamIcon from '@mui/icons-material/Videocam';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import MicIcon from '@mui/icons-material/Mic';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadIcon from '@mui/icons-material/Upload';

// --- Styled component for the main wrapper ---
const RecorderWrapper = styled('div', {
  shouldForwardProp: (prop) => prop !== 'position',
})(({ position }) => ({
  position: position,
  bottom: position === 'fixed' ? 16 : undefined,
  left: position === 'fixed' ? 16 : undefined,
  zIndex: position === 'fixed' ? 1300 : undefined,
  display: 'flex',
  alignItems: 'flex-end',
  gap: '16px',
}));

// --- Style for the Preview Modal ---
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'clamp(300px, 90vw, 800px)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 10,
};

export default function ScreenRecorder({ onUpload, position = 'fixed' }) {
    const mediaRecorderRef = useRef(null);
    const timerRef = useRef(null);
    const [status, setStatus] = useState('idle'); // 'idle', 'recording', 'preview'
    const [isControlsVisible, setIsControlsVisible] = useState(false);
    const [videoBlob, setVideoBlob] = useState(null);
    const [includeMic, setIncludeMic] = useState(true);
    const [recordTime, setRecordTime] = useState(0);
    const [error, setError] = useState(null);

    useEffect(() => () => clearInterval(timerRef.current), []);

    const startRecording = async () => {
        setStatus('recording');
        setError(null);
        setVideoBlob(null);

        try {
            const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: { cursor: "always" }, audio: true });
            const stream = includeMic
                ? new MediaStream([...screenStream.getVideoTracks(), ...(await navigator.mediaDevices.getUserMedia({ audio: true })).getAudioTracks()])
                : screenStream;

            const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
            const chunks = [];
            recorder.ondataavailable = (e) => chunks.push(e.data);
            recorder.onstop = () => {
                const blob = new Blob(chunks, { type: "video/webm" });
                setVideoBlob(blob);
                setStatus('preview');
                stream.getTracks().forEach(track => track.stop());
            };
            recorder.start();
            mediaRecorderRef.current = recorder;
            setRecordTime(0);
            timerRef.current = setInterval(() => setRecordTime(prev => prev + 1), 1000);
        } catch (err) {
            setError("Could not start recording. Please grant permission.");
            setStatus('idle');
            setIsControlsVisible(false);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            clearInterval(timerRef.current);
        }
    };

    const handleReset = () => {
        setStatus('idle');
        setVideoBlob(null);
        setRecordTime(0);
        setError(null);
        setIsControlsVisible(false);
    };

    const formatTime = (sec) => `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;
    const videoUrl = videoBlob ? URL.createObjectURL(videoBlob) : null;

    return (
        <>
            <RecorderWrapper position={position}>
                {/* --- Floating Action Button (FAB) --- */}
                <Tooltip title="Screen Recorder" arrow>
                <Fab
  aria-label="record"
  onClick={() => setIsControlsVisible(!isControlsVisible)}
  sx={{
    width: 38,
    height: 38,
    minHeight: 38,
    backgroundColor: "#f9fafb",
    color: "#374151",
    borderRadius: "10px",
    boxShadow: "none",
    border: "1px solid #e5e7eb",
    transition: "all 0.18s ease",
     "&:hover": {
    backgroundColor: "rgba(25, 118, 210, 0.06)",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    },
  }}
>
  {status === "recording" ? <StopCircleIcon /> : <VideocamIcon />}
</Fab>
</Tooltip>
                {/* --- Recording Controls Strip --- */}
                <Slide direction="right" in={isControlsVisible || status === 'recording'} mountOnEnter unmountOnExit>
                    <Paper elevation={4} sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, borderRadius: 2 }}>
                        {status === 'idle' && (
                            <>
                                <FormControlLabel
                                    control={<Checkbox checked={includeMic} onChange={(e) => setIncludeMic(e.target.checked)} />}
                                    label="Mic"
                                />
                                <Button variant="contained" onClick={startRecording}>Start</Button>
                            </>
                        )}
                        {status === 'recording' && (
                            <>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'red', animation: 'pulse 1.5s infinite' }} />
                                    <Typography variant="h6" component="span" sx={{ fontFamily: 'monospace' }}>{formatTime(recordTime)}</Typography>
                                </Box>
                                <Button variant="contained" color="error" onClick={stopRecording}>Stop</Button>
                            </>
                        )}
                    </Paper>
                </Slide>
            </RecorderWrapper>

            {/* --- Preview Modal --- */}
            <Modal
                open={status === 'preview'}
                onClose={handleReset}
                aria-labelledby="recording-preview-title"
            >
                <Box sx={modalStyle}>
                    <Typography id="recording-preview-title" variant="h6" component="h2" sx={{ mb: 2 }}>
                        Recording Preview
                    </Typography>
                    <video src={videoUrl} controls style={{ width: '100%', borderRadius: '8px' }} />
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2, flexWrap: 'wrap' }}>
                        <Button variant="outlined" startIcon={<DownloadIcon />} href={videoUrl} download={`recording-${Date.now()}.webm`}>Download</Button>
                        <Button variant="outlined" color="secondary" startIcon={<DeleteIcon />} onClick={handleReset}>Delete</Button>
                        {onUpload && <Button variant="contained" startIcon={<UploadIcon />} onClick={() => onUpload(videoBlob)}>Upload</Button>}
                    </Box>
                </Box>
            </Modal>
            
            {/* Simple CSS for the recording pulse animation */}
            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `}</style>
        </>
    );
}