// ToolsBoard.jsx
import * as React from "react";
import {
    Box,
    Stack,
    Typography,
    ButtonBase,
    Avatar,
    Badge,
} from "@mui/material";
import PropTypes from "prop-types";
import YouTube from "react-youtube";

/**
 * Tool item shape
 * {
 *   id?: string|number,
 *   label: string,
 *   subtitle?: string,
 *   media: {
 *     type: 'icon'|'img'|'video',
 *     node?: React.ReactNode,        // when type='icon'
 *     src?: string,                  // when type='img'|'video'
 *     alt?: string,                  // for images
 *     poster?: string,               // for videos
 *     loop?: boolean,                // for videos
 *     muted?: boolean,               // for videos (recommended true)
 *   },
 *   badge?: number | { variant?: 'standard'|'dot', content?: number, color?: any },
 *   onClick?: (tool) => void
 * }
 */

export default function ToolsBoard({
    items = [],
    title = "Tools",
    /** layout: 'grid' -> multi-row grid; 'strip' -> single-row, horizontal scroll */
    layout = "grid",
    /** how many columns in grid layout on md+ screens (xs collapses automatically) */
    columns = 5,
    gap = 2,
    /** tile style */
    tileSize = 156,
    rounded = 8,
    /** media size inside tile */
    mediaSize = 128,
    /** subtitle below the media (per item) is shown if provided */
    showSubtitle = true,
    /** highlight rotation */
    highlight = true,
    highlightInterval = 3500,
    pauseHighlightOnHover = true,
    /** when a new item is highlighted, auto-scroll it into view if needed */
    autoScroll = false,
    /** autoplay video when its item is highlighted */
    mediaAutoplayOnHighlight = true,
    /** callback when highlight changes */
    onHighlightChange,
    respectUserPause = true,           // NEW: don’t auto-play if user paused
    showVideoOverlay = true,
}) {
    const [active, setActive] = React.useState(0);
    const [paused, setPaused] = React.useState(false);
    const containerRef = React.useRef(null);
    const videoRefs = React.useRef([]);

    const manualPause = React.useRef([]); // boolean per index
    React.useEffect(() => {
        manualPause.current = manualPause.current.slice(0, items.length);
    }, [items.length]);

    // Keep refs aligned with items length
    React.useEffect(() => {
        videoRefs.current = videoRefs.current.slice(0, items.length);
    }, [items.length]);

    // Round-robin highlight rotation
    React.useEffect(() => {
        if (!highlight || paused) return;
        const t = setInterval(() => {
            setActive((i) => (i + 1) % Math.max(1, items.length));
        }, Math.max(400, highlightInterval));
        return () => clearInterval(t);
    }, [highlight, paused, items.length, highlightInterval]);

    // Scroll active item into view
    React.useEffect(() => {
        if (!autoScroll) return;
        const container = containerRef.current;
        const activeEl = container?.querySelector(`[data-tool-idx="${active}"]`);
        if (container && activeEl) {
            activeEl.scrollIntoView({
                block: layout === "grid" ? "nearest" : "center",
                inline: "center",
                behavior: "smooth",
            });
        }
        onHighlightChange?.(active, items[active]);
    }, [active, autoScroll, layout, items, onHighlightChange]);

    // Autoplay/pause videos on highlight
    React.useEffect(() => {
        if (!mediaAutoplayOnHighlight) return;
        videoRefs.current.forEach((vid, idx) => {
            if (!vid) return;
            if (idx === active) {
                if (respectUserPause && manualPause.current[idx]) return; // ⬅️ don’t force play
                // attempt to play silently (muted suggested)
                const p = vid.play?.();
                if (p?.catch) p.catch(() => { }); // ignore autoplay rejections
            } else {
                try {
                    vid.pause?.();
                    vid.currentTime = 0;
                } catch {
                    console.log("Error while playing video.")
                }
            }
        });
    }, [active, mediaAutoplayOnHighlight, respectUserPause]);

    const isStrip = layout === "strip";

    return (
        <Box>
            {title && (
                <Typography variant="h6" sx={{ mb: 1.5 }}>
                    {title}
                </Typography>
            )}



            <Box
                ref={containerRef}
                onMouseEnter={() => pauseHighlightOnHover && setPaused(true)}
                onMouseLeave={() => pauseHighlightOnHover && setPaused(false)}
                sx={
                    isStrip
                        ? {
                            display: "flex",
                            gap,
                            overflowX: "auto",
                            overflowY: "hidden",
                            pb: 1,
                            scrollSnapType: "x mandatory",
                            "& > *": { scrollSnapAlign: "start" },
                        }
                        : {
                            display: "grid",
                            gridTemplateColumns: {
                                xs: `repeat(3, minmax(0, 1fr))`,
                                sm: `repeat(4, minmax(0, 1fr))`,
                                md: `repeat(${columns}, minmax(0, 1fr))`,
                            },
                            gap,
                        }
                }
            >
                {items.map((t, idx) => {
                    const activeTile = idx === active;
                    const badgeProps =
                        typeof t.badge === "number"
                            ? { badgeContent: t.badge, color: "primary" }
                            : t.badge
                                ? {
                                    variant: t.badge.variant ?? "standard",
                                    badgeContent: t.badge.content,
                                    color: t.badge.color ?? "primary",
                                }
                                : null;

                    return (
                        <Stack
                            key={t.id ?? idx}
                            data-tool-idx={idx}
                            alignItems="center"
                            spacing={1}
                            sx={{
                                minWidth: isStrip ? 96 : undefined, // ensures horizontal tile width in strip
                            }}
                        >
                            <ButtonBase
                                aria-label={t.label}
                                onClick={() => t.onClick?.(t, idx)}
                                sx={{
                                    width: tileSize,
                                    height: tileSize,
                                    borderRadius: rounded,
                                    border: "1px solid",
                                    borderColor: activeTile ? "primary.main" : "divider",
                                    bgcolor: "background.paper",
                                    boxShadow: activeTile ? 3 : 0,
                                    transform: activeTile ? "translateY(-1px)" : "none",
                                    transition: "all .15s ease",
                                    display: "grid",
                                    placeItems: "center",
                                    position: "relative",
                                }}
                            >
                                {badgeProps ? (
                                    <Badge
                                        overlap="circular"
                                        {...badgeProps}
                                        anchorOrigin={{ vertical: "top", horizontal: "right" }}
                                        sx={{
                                            position: "absolute",
                                            top: 6,
                                            right: 6,
                                            "& .MuiBadge-badge": { minWidth: 16, height: 16 },
                                        }}
                                    >
                                        <Media media={t.media} size={mediaSize}
                                            videoRefCb={(el) => (videoRefs.current[idx] = el)}
                                            showOverlay={showVideoOverlay}
                                            rounded={rounded}
                                            // update manual pause map when user toggles
                                            onVideoToggle={(playing) => { manualPause.current[idx] = !playing; }}
                                        />
                                    </Badge>
                                ) : (
                                    <Media media={t.media} rounded={rounded} showOverlay={showVideoOverlay} size={mediaSize} videoRefCb={(el) => (videoRefs.current[idx] = el)} />
                                )}
                            </ButtonBase>

                            <Typography variant="caption" textAlign="center">
                                {t.label}
                            </Typography>

                            {showSubtitle && t.subtitle && (
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    textAlign="center"
                                    sx={{ lineHeight: 1.2 }}
                                >
                                    {t.subtitle}
                                </Typography>
                            )}
                        </Stack>
                    );
                })}
            </Box>
        </Box>
    );
}


function Media({
    media,
    size,
    videoRefCb,
    showOverlay = true,
    highlightActive = false,
    autoplayOnHighlight = true,
    manualPaused = false,
    onManualPauseChange,
    rounded
}) {
    if (!media) return null;

    // ICON
    if (media.type === "icon") {
        return (
            <Box aria-hidden sx={{ width: size, height: size, display: "grid", placeItems: "center" }}>
                {media.node}
            </Box>
        );
    }

 // IMAGE
if (media.type === "img") {
  return (
    <Box
      aria-hidden
      sx={{
        width: size,
        height: size,
        display: "grid",
        justifyContent: "center",
        alignItems: "center",
        placeItems:"center"
      }}
    >
      <Avatar
        variant="rounded"
        src={media.src}
        alt={media.alt || ""}
        sx={{ padding:0, ml:-1, mt:1, width: size - 5, height: size -5 }}
      />
    </Box>
  );
}


    // PLAIN <video>
    if (media.type === "video") {
        const vidRef = React.useRef(null);
        const [isPlaying, setIsPlaying] = React.useState(false);
        const [hover, setHover] = React.useState(false);

        // wire ref up to parent
        const wireRef = (el) => { vidRef.current = el; videoRefCb?.(el); };

        // reflect native play/pause to local state
        React.useEffect(() => {
            const el = vidRef.current;
            if (!el) return;
            const onPlay = () => setIsPlaying(true);
            const onPause = () => setIsPlaying(false);
            el.addEventListener("play", onPlay);
            el.addEventListener("pause", onPause);
            return () => { el.removeEventListener("play", onPlay); el.removeEventListener("pause", onPause); };
        }, []);

        // autoplay on highlight (unless user paused)
        React.useEffect(() => {
            const el = vidRef.current;
            if (!el) return;
            if (autoplayOnHighlight && highlightActive && !manualPaused) {
                const p = el.play?.(); if (p?.catch) p.catch(() => { });
            } else {
                try { el.pause?.(); el.currentTime = 0; } catch { }
            }
        }, [highlightActive, autoplayOnHighlight, manualPaused]);

        const togglePlay = (e) => {
            e?.stopPropagation?.();
            const el = vidRef.current; if (!el) return;
            if (el.paused) {
                const p = el.play?.(); if (p?.catch) p.catch(() => { });
                onManualPauseChange?.(false);
            } else {
                el.pause?.(); onManualPauseChange?.(true);
            }
        };

        return (
            <Box
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                sx={{ width: size, height: size, position: "relative", borderRadius: rounded, overflow: "hidden" }}
            >
                <video
                    ref={wireRef}
                    src={media.src}
                    poster={media.poster}
                    muted={media.muted ?? true}
                    loop={media.loop ?? true}
                    playsInline
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
                {showOverlay && (
                    <OverlayButton isPlaying={isPlaying} hover={hover} onClick={togglePlay} />
                )}
            </Box>
        );
    }

    // YOUTUBE (via react-player)
    const videoId = React.useMemo(() => {
        try {
            const u = new URL(media.url || "");
            if (u.hostname.includes("youtu.be")) return u.pathname.slice(1);
            if (u.searchParams.get("v")) return u.searchParams.get("v");
            const parts = u.pathname.split("/");
            const idx = parts.findIndex(p => p === "embed" || p === "shorts");
            if (idx >= 0 && parts[idx + 1]) return parts[idx + 1];
        } catch { }
        return null;
    }, [media.url]);

    const ytRef = React.useRef(null);
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [ready, setReady] = React.useState(false);
    const [hover, setHover] = React.useState(false);

    // Drive play/pause from highlight (respect manual pause if you're tracking it)
    React.useEffect(() => {
        const p = ytRef.current;
        if (!p || !ready) return;
        const shouldPlay = autoplayOnHighlight && highlightActive && !manualPaused;
        try {
            if (shouldPlay) p.playVideo();
            else p.pauseVideo();
        } catch { }
    }, [ready, autoplayOnHighlight, highlightActive, manualPaused]);

    const togglePlay = (e) => {
        e?.stopPropagation?.();
        const p = ytRef.current;
        if (!p) return;
        try {
            if (isPlaying) {
                p.pauseVideo();
                onManualPauseChange?.(true);
            } else {
                p.playVideo();
                onManualPauseChange?.(false);
            }
        } catch { }
    };

    return (
        <Box
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            sx={{
                width: size,
                height: size,
                position: "relative",
                borderRadius: rounded,
                overflow: "hidden",
                bgcolor: "black",
            }}
        >
            {videoId && (
                <YouTube
                    videoId={videoId}
                    opts={{
                        width: "100%",
                        height: "100%",
                        playerVars: {
                            // keep native controls off if you prefer your overlay
                            controls: media.controls ? 1 : 0,
                            autoplay: 0,            // we control via API, avoids race
                            mute: media.muted ?? true ? 1 : 0,
                            loop: media.loop ? 1 : 0,
                            playlist: media.loop ? videoId : undefined, // required for loop
                            rel: 0,
                            modestbranding: 1,
                            playsinline: 1,
                        },
                    }}
                    onReady={(e) => {
                        ytRef.current = e.target;
                        setReady(true);
                        if (media.muted ?? true) {
                            try { e.target.mute(); } catch { }
                        }
                    }}
                    onStateChange={(e) => {
                        // 1: playing, 2: paused, 0: ended
                        if (e.data === 1) setIsPlaying(true);
                        else if (e.data === 2 || e.data === 0) setIsPlaying(false);
                    }}
                    iframeClassName="yt-iframe"
                    style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                    }}
                />
            )}

            {/* Force iframe to fill the box */}
            <Box
                sx={{
                    position: "absolute",
                    inset: 0,
                    "& .yt-iframe": { width: "100%", height: "100%" },
                }}
            />

            {/* Our overlay: show ONLY on hover to avoid clashing with YouTube’s paused overlay */}
            {ready && (
                <OverlayButton
                    isPlaying={isPlaying}
                    hover={hover}
                    onClick={togglePlay}
                    onlyOnHover
                />
            )}
        </Box>
    );

}



function OverlayButton({ isPlaying, hover, onClick, onlyOnHover = false }) {
    return (
        <Box
            onClick={onClick}
            role="button"
            aria-label={isPlaying ? "Pause" : "Play"}
            sx={{
                position: "absolute",
                inset: 0,
                display: "grid",
                placeItems: "center",
                // if onlyOnHover -> show on hover; else -> show when paused or on hover
                opacity: onlyOnHover ? (hover ? 1 : 0) : (!isPlaying || hover ? 1 : 0),
                transition: "opacity .2s",
                cursor: "pointer",
            }}
        >
            <Box
                sx={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    bgcolor: "rgba(0,0,0,0.55)",
                    color: "#fff",
                    display: "grid",
                    placeItems: "center",
                    boxShadow: 1,
                }}
            >
                {isPlaying ? (
                    <svg width="14" height="14" viewBox="0 0 24 24">
                        <rect x="5" y="4" width="4" height="16" fill="currentColor" />
                        <rect x="15" y="4" width="4" height="16" fill="currentColor" />
                    </svg>
                ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24">
                        <polygon points="8,5 19,12 8,19" fill="currentColor" />
                    </svg>
                )}
            </Box>
        </Box>
    );
}


Media.propTypes = {
    media: PropTypes.any,
    size: PropTypes.number,
    videoRefCb: PropTypes.func,
    showOverlay: PropTypes.bool,
    highlightActive: PropTypes.bool,
    autoplayOnHighlight: PropTypes.bool,
    manualPaused: PropTypes.bool,
    onManualPauseChange: PropTypes.func,
};


ToolsBoard.propTypes = {
    items: PropTypes.arrayOf(PropTypes.object),
    title: PropTypes.string,
    layout: PropTypes.oneOf(["grid", "strip"]),
    columns: PropTypes.number,
    gap: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    tileSize: PropTypes.number,
    rounded: PropTypes.number,
    mediaSize: PropTypes.number,
    showSubtitle: PropTypes.bool,
    highlight: PropTypes.bool,
    highlightInterval: PropTypes.number,
    pauseHighlightOnHover: PropTypes.bool,
    autoScroll: PropTypes.bool,
    mediaAutoplayOnHighlight: PropTypes.bool,
    onHighlightChange: PropTypes.func,
    respectUserPause: PropTypes.bool,
    showVideoOverlay: PropTypes.bool
};
