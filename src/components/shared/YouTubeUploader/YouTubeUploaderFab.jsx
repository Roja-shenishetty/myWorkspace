import React, { useState, useEffect, useRef } from 'react';
import { Fab, Popover, Card, CardContent, Button, Typography, Box, CircularProgress, Link, Snackbar, Alert,Tooltip } from '@mui/material';
import YouTubeIcon from '@mui/icons-material/YouTube';
import GoogleIcon from '@mui/icons-material/Google';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ReplayIcon from '@mui/icons-material/Replay';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import StopCircleOutlinedIcon from '@mui/icons-material/StopCircleOutlined';


// --- Your API Credentials ---
const CLIENT_ID = "749462751340-v9bgtb4f847eef8d72a4r58p4rsj8lsu.apps.googleusercontent.com";
const API_KEY = "AIzaSyC5eA5BxSDq_hsCcEWTo3ZQT5ZOkf8OuEg";
const SCOPES = "https://www.googleapis.com/auth/youtube.upload";
const DISCOVERY_DOCS = [
    "https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest",
];


export default function YouTubeUploaderFab() {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [videoFile, setVideoFile] = useState(null);
    const [tokenClient, setTokenClient] = useState(null);
    // MODIFIED: Added 'polling_stopped' state
    const [uploadState, setUploadState] = useState('idle'); // 'idle', 'uploading', 'processing', 'polling_stopped', 'done', 'failed'
    const [uploadedVideoData, setUploadedVideoData] = useState(null);
    const [isCopied, setIsCopied] = useState(false);

    // --- Snackbar State ---
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });


    const [anchorEl, setAnchorEl] = useState(null);
    const pollingIntervalRef = useRef(null);

    // --- NEW: State for in-popup error messages ---
    const [error, setError] = useState(null);

    const handleFabClick = (event) => {
        if (['done', 'failed', 'polling_stopped'].includes(uploadState)) {
            handleReset();
        } else {
            setAnchorEl(event.currentTarget);
        }
    };
    const handlePopoverClose = () => setAnchorEl(null);
    const open = Boolean(anchorEl);

    const stopPolling = () => {
        if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            // NEW: Set state to give visual feedback
            setUploadState('polling_stopped');
        }
    };

    const handleReset = () => {
        setVideoFile(null);
        setUploadedVideoData(null);
        setUploadState('idle');
        setIsCopied(false);
        setAnchorEl(null);
        stopPolling();
    };

    useEffect(() => {
        const gapiScript = document.createElement("script");
        gapiScript.src = "https://apis.google.com/js/api.js";
        gapiScript.onload = () => window.gapi.load('client', initializeGapiClient);
        document.body.appendChild(gapiScript);
        const gisScript = document.createElement("script");
        gisScript.src = "https://accounts.google.com/gsi/client";
        gisScript.onload = gisLoaded;
        document.body.appendChild(gisScript);
        return () => {
            document.body.removeChild(gapiScript);
            document.body.removeChild(gisScript);
            // if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
            stopPolling();
        };
    }, []);

    const initializeGapiClient = async () => {
        try { await window.gapi.client.init({ apiKey: API_KEY, discoveryDocs: DISCOVERY_DOCS }); }
        catch (error) { console.error("Error initializing GAPI client:", error); }
    };

    const gisLoaded = () => {
        const client = window.google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID, scope: SCOPES,
            callback: (tokenResponse) => {
                if (tokenResponse?.access_token) {
                    window.gapi.client.setToken({ access_token: tokenResponse.access_token });
                    setIsSignedIn(true);
                }
            },
        });
        setTokenClient(client);
    };

    const handleSignIn = () => tokenClient?.requestAccessToken();
    const handleFileChange = (e) => {
        setVideoFile(e.target.files[0]);
        setUploadedVideoData(null);
        setUploadState('idle');
    };

    const handleCopyLink = () => {
        if (!uploadedVideoData) return;
        const videoUrl = `https://www.youtube.com/watch?v=${uploadedVideoData.id}`;
        navigator.clipboard.writeText(videoUrl).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
        navigator.clipboard.writeText(videoUrl).then(() => {
            setSnackbar({ open: true, message: 'Video link copied to clipboard!', severity: 'success' });
        });
    };

    const uploadVideo = async () => {
        if (!videoFile) return;
        setUploadState('uploading');
        try {
            const metadata = { snippet: { title: videoFile.name, description: "Uploaded from my React App" }, status: { privacyStatus: "public" } };
            const formData = new FormData();
            formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
            formData.append('video', videoFile);
            const response = await fetch('https://www.googleapis.com/upload/youtube/v3/videos?part=snippet,status', {
                method: 'POST',
                headers: { Authorization: `Bearer ${window.gapi.client.getToken().access_token}` },
                body: formData,
            });

            // NEW: Check for non-OK responses to get the error message
            if (!response.ok) {
                const errorData = await response.json();
                // This specifically checks for the quota error message
                if (errorData.error.message.includes("exceeded the number of videos")) {
                    throw new Error("You have reached your daily YouTube upload limit. Please try again tomorrow.");
                }
                throw new Error(`Upload failed with status: ${response.status}`);
            } 
            
            const responseData = await response.json();

            setUploadedVideoData({ id: responseData.id, title: responseData.snippet.title });
            setVideoFile(null);
            setUploadState('processing');
            pollVideoStatus(responseData.id);
        } catch (error) {
            console.error("Upload failed", error);
            // 3. The snackbar is triggered with the correct message
        setSnackbar({ open: true, message: error.message, severity: 'error' });
        
        setUploadState('failed');
            setError(error.message); // Set the error state
        }
    };

    const pollVideoStatus = (videoId) => {
        pollingIntervalRef.current = setInterval(async () => {
            try {
                const response = await window.gapi.client.youtube.videos.list({ part: 'processingDetails,status', id: videoId });
                const video = response.result.items[0];
                if (video.processingDetails?.processingStatus === 'succeeded') {
                    clearInterval(pollingIntervalRef.current);
                    setUploadState('done');
                } else if (video.processingDetails?.processingStatus === 'failed') {
                    clearInterval(pollingIntervalRef.current);
                    setUploadState('failed');
                }
            } catch (error) {
                console.error("Error polling video status:", error);
                clearInterval(pollingIntervalRef.current);
                setUploadState('failed');
            }
        }, 5000);
    };

    const renderContent = () => {
        if (!isSignedIn) {
            return <Button variant="contained" startIcon={<GoogleIcon />} onClick={handleSignIn}>Sign in with Google</Button>;
        }
        if (uploadState === 'uploading') {
            return <Box sx={{ textAlign: 'center' }}><CircularProgress /><Typography sx={{ mt: 2 }}>Uploading video...</Typography></Box>;
        }
        if (uploadedVideoData) { // Covers 'processing', 'polling_stopped', 'done', 'failed'
            return (
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="subtitle1" color="success.main">Upload Successful!</Typography>
                    <Typography variant="body2" sx={{ mt: 1, fontWeight: 'medium' }}>{uploadedVideoData.title}</Typography>

                    {/* Status Indicator */}
                    <Box sx={{ my: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
                        {uploadState === 'processing' && <><CircularProgress size={16} /><Typography variant="caption">Processing...</Typography></>}
                        {/* NEW: UI for when polling is stopped */}
                        {uploadState === 'polling_stopped' && <><StopCircleOutlinedIcon color="action" sx={{ fontSize: 18 }} /><Typography variant="caption">Status checking stopped.</Typography></>}
                        {uploadState === 'done' && <><CheckCircleIcon color="success" sx={{ fontSize: 18 }} /><Typography variant="caption" color="success.main">Video is Ready!</Typography></>}
                        {uploadState === 'failed' && <Typography variant="caption" color="error.main">Processing Failed</Typography>}
                    </Box>

                    {/* Links and Actions */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                        <Button variant="outlined" size="small" onClick={handleCopyLink} startIcon={isCopied ? <CheckIcon /> : <ContentCopyIcon />}>
                            {isCopied ? 'Copied!' : 'Copy Link'}
                        </Button>
                        {uploadState === 'done' &&
                            <Link href={`https://www.youtube.com/watch?v=${uploadedVideoData.id}`} target="_blank" rel="noopener noreferrer" component={Button} variant="outlined" size="small">
                                View Video
                            </Link>
                        }
                        {uploadState === 'processing' &&
                            <Button variant="outlined" size="small" color="secondary" onClick={stopPolling}>Stop Checking</Button>
                        }
                    </Box>
                </Box>
            );
        }
        // Default 'idle' state
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <Button component="label" variant="outlined" startIcon={<UploadFileIcon />}>Choose Video
                    <input type="file" accept="video/*" hidden onChange={handleFileChange} />
                </Button>
                {videoFile && <Typography variant="caption">{videoFile.name}</Typography>}
                <Button variant="contained" color="error" onClick={uploadVideo} disabled={!videoFile}>Upload Now</Button>
            </Box>
        );
    };

    return (
        <>
        <Tooltip title="Youtube Loader" arrow>
            <Fab
  onClick={handleFabClick}
  sx={{
    width: { xs: 26, sm: 38 },
  height: { xs: 26, sm: 38 },
  minHeight: "unset",
  backgroundColor: "#f9fafb",
  color: "#374151",
  borderRadius: "8px",
  boxShadow: "none",
  border: "1px solid #e5e7eb",
  transition: "all 0.18s ease",

  "&:hover": {
    backgroundColor: "rgba(25, 118, 210, 0.06)",
    transform: "translateY(-1px)",
    boxShadow: "0 3px 8px rgba(0,0,0,0.06)",
  },
  }}
>
  {['done', 'failed', 'polling_stopped'].includes(uploadState)
    ? <ReplayIcon />
    : <YouTubeIcon />
  }
</Fab>
</Tooltip>
            <Popover open={open} anchorEl={anchorEl} onClose={handlePopoverClose} anchorOrigin={{ vertical: 'top', horizontal: 'left' }} transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Card sx={{ width: 360, minHeight: 180 }}>
                    <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 2 }}>
                        <Typography variant="h6" component="div" sx={{ textAlign: 'center', fontWeight: 'bold', mb: 1 }}>Upload to YouTube</Typography>
                          {/* --- NEW: Error Display Area --- */}
                        {error && (
                            <Alert severity="error" onClose={() => setError(null)}>
                                {error}
                            </Alert>
                        )}
                        {renderContent()}
                    </CardContent>
                </Card>
            </Popover>

            {/* --- NEW: Snackbar Component --- */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
}