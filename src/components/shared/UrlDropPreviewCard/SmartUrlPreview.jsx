import React, { useState, useEffect, useRef } from 'react';
import YouTube from 'react-youtube';
import {
    Box, Typography, Avatar, CircularProgress, Link as MuiLink
} from '@mui/material';
import QRCode from 'react-qr-code';

// Utility to extract YouTube video ID from URL
const getYouTubeVideoId = (url) => {
    try {
        // Support multiple URL formats
        const regex =
            /(?:youtube(?:-nocookie)?\.com\/(?:[^/]+\/.+\/|(?:v|embed|shorts|watch)?(?:\.php)?(?:\?.*v=|\/))|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = url.match(regex);
        return match ? match[1] : null;
    } catch {
        return null;
    }
};

// Detect if URL is YouTube or Vimeo video
const getEmbeddedVideoUrl = (url) => {
    try {
        const parsed = new URL(url);

        if (parsed.hostname.includes('youtube.com') || parsed.hostname.includes('youtu.be')) {
            const videoId = getYouTubeVideoId(url);
            return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
        }

        if (parsed.hostname.includes('vimeo.com')) {
            const videoId = parsed.pathname.split('/')[1];
            return `https://player.vimeo.com/video/${videoId}`;
        }

        return null;
    } catch {
        return null;
    }
};

// Fetch metadata utility (unchanged)
export async function fetchMetadata(url) {
    if (!url) return { url: '', domain: "", title: '', favicon: '' };

    try {
        const res2 = await fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}`);
        const data2 = await res2.json();
        console.log(data2);

        const res = await fetch(`https://corsproxy.io/?${encodeURIComponent(url)}`);
        const html = await res.text();

        if (/Attention Required!|Cloudflare/i.test(html)) {
            const domain = new URL(url).hostname;
            const favicon = `https://www.google.com/s2/favicons?domain=${domain}`;
            return { url, domain, title: domain, favicon };
        }

        const titleMatch = html.match(/<title>(.*?)<\/title>/i);
        const title = titleMatch ? titleMatch[1].trim() : '';
        const domain = new URL(url).hostname;
        const favicon = `https://www.google.com/s2/favicons?domain=${domain}`;

        return { url, domain, title, favicon };
    } catch {
        const domain = (() => {
            try { return new URL(url).hostname; } catch { return ''; }
        })();
        const favicon = domain ? `https://www.google.com/s2/favicons?domain=${domain}` : '';
        return { url, domain, title: domain, favicon };
    }
}

// YouTubePlayer component with localStorage watch progress tracking
function YouTubePlayer({ videoId, width, height }) {
    const playerRef = useRef(null);
    const progressInterval = useRef(null);


    const onStateChange = (event) => {
        const playerState = event.data;
        const currentTime = playerRef.current.getCurrentTime();

        localStorage.setItem(`yt-progress-${videoId}`, currentTime);

        if (playerState === 1) { // playing
            localStorage.setItem(`yt-playing-${videoId}`, 'true');
        } else if (playerState === 2 || playerState === 0) { // paused or ended
            localStorage.setItem(`yt-playing-${videoId}`, 'false');
        }
    };


    const onReady = (event) => {
        playerRef.current = event.target;
        const savedPosition = localStorage.getItem(`yt-progress-${videoId}`);
        if (savedPosition) {
            playerRef.current.seekTo(parseFloat(savedPosition), true);
        }

        const isPlaying = localStorage.getItem(`yt-playing-${videoId}`) === 'true';
        if (isPlaying) {
            playerRef.current.playVideo();
        } else {
            playerRef.current.pauseVideo();
        }
    };

    const onPlay = () => {
        if (progressInterval.current) clearInterval(progressInterval.current);
        progressInterval.current = setInterval(() => {
            if (playerRef.current) {
                const currentTime = playerRef.current.getCurrentTime();
                localStorage.setItem(`yt-progress-${videoId}`, currentTime);
            }
        }, 1000);
    };

    const onPause = () => {
        if (progressInterval.current) {
            clearInterval(progressInterval.current);
            progressInterval.current = null;
        }
    };

    const onEnd = () => {
        onPause();
        localStorage.removeItem(`yt-progress-${videoId}`);
    };

    useEffect(() => {
        return () => {
            if (progressInterval.current) clearInterval(progressInterval.current);
        };
    }, []);

    const opts = {
        width: width || '100%',
        height: height || 360,
        playerVars: {
            autoplay: 0,
        },
    };

    return (
        <YouTube
            videoId={videoId}
            opts={opts}
            onReady={onReady}
            onPlay={onPlay}
            //onPause={onPause}
            onEnd={onEnd}
             onStateChange={onStateChange}
        />
    );
}

// Main SmartUrlPreview component
export default function SmartUrlPreview({ url, showQrCode, printMode, width, height }) {
    const [loading, setLoading] = useState(true);
    const [type, setType] = useState('loading'); // loading | embed | image | link | error
    const [meta, setMeta] = useState({ title: '', favicon: '' });
    const [embedUrl, setEmbedUrl] = useState('');
    const [videoId, setVideoId] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const detectType = async () => {
            try {
                const embed = getEmbeddedVideoUrl(url);
                if (embed) {
                    setEmbedUrl(embed);

                    if (/youtube\.com|youtu\.be/.test(url)) {
                        const id = getYouTubeVideoId(url);
                        setVideoId(id);
                    } else {
                        setVideoId(null);
                    }

                    if (isMounted) setType('embed');
                    return;
                }

                // Try image detection first
                const img = new Image();
                img.onload = () => {
                    if (isMounted) setType('image');
                };
                img.onerror = async () => {
                    const metadata = await fetchMetadata(url);
                    if (isMounted) {
                        setType('link');
                        setMeta(metadata);
                    }
                };
                img.src = url;
            } catch {
                if (isMounted) {
                    setType('link');
                    setMeta({ title: url, favicon: '' });
                }
            }
        };

        detectType();

        return () => {
            isMounted = false;
        };
    }, [url]);

    if (type === 'loading') return <CircularProgress size={24} />;
    if (type === 'error') return <Typography color="error">Failed to load preview</Typography>;

    if (type === 'embed' && videoId) {
        return <YouTubePlayer videoId={videoId} width={width} height={height} />;
    }

    if (type === 'embed') {
        return (
            <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
                <iframe
                    src={embedUrl}
                    title="Embedded Video"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: width || "100%",
                        height: height || "100%",
                        border: 'none',
                        borderRadius: '8px'
                    }}
                />
            </Box>
        );
    }

    if (type === 'image') {
        return (
            <Box component="img" src={url} alt="Preview image" sx={{ width: width || '100%', height: height || 'auto', borderRadius: 1 }} />
        );
    }

    // Link preview
    return (
        <Box sx={{ border: '1px solid #ccc', borderRadius: 2, p: 1, backgroundColor: 'white' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {meta.favicon && <Avatar src={meta.favicon} alt="favicon" />}
                <MuiLink href={url} target="_blank" underline="hover" rel="noopener noreferrer" sx={{ wordBreak: 'break-all' }}>
                    <Typography variant="body2">{meta.title ? meta.title : meta.domain}</Typography>
                </MuiLink>
            </Box>
            {showQrCode && (
                <Box sx={{ display: 'inline-block', p: 1, backgroundColor: 'white', mt: 1 }}>
                    <QRCode value={url} size={64} />
                </Box>
            )}
        </Box>
    );
}
