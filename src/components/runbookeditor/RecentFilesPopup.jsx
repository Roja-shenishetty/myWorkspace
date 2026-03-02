import React, { useState } from "react";
import {
    Fab,
    Popover,
    Box,
    Typography,
    List,
    ListItem,
    ListItemSecondaryAction,
    IconButton,
    ListItemText,
    Divider,
    Link,
    Tooltip,
    Button,
    TextField
} from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import ShareIcon from "@mui/icons-material/Share";
import WhatsAppIcon from '@mui/icons-material/WhatsApp'; // Or use any WhatsApp icon svg
import FileListItem from "./FileListItem";

function formatDateTime(dateString) {
    const d = new Date(dateString);
    return d.toLocaleString();
}

export default function RecentFilesPopup({ recentFiles = [], onFileLoad, onUpdateRecentFiles }) {
   
    const [anchorEl, setAnchorEl] = useState(null);
    const [infoAnchorEl, setInfoAnchorEl] = useState(null);
    const [currentInfoFile, setCurrentInfoFile] = useState(null);
    const [annotationText, setAnnotationText] = useState("");

    const handleClick = (e) => setAnchorEl(e.currentTarget);
    const handleClose = () => {
        setAnchorEl(null);
        closeInfoPopover();
    };

    const open = Boolean(anchorEl);

    const handleOpenInfo = (event, file) => {
        event.stopPropagation(); // Prevent list item click
        setCurrentInfoFile(file);
        setAnnotationText(file.annotation || "");
        setInfoAnchorEl(event.currentTarget);
    };

    const closeInfoPopover = () => {
        setInfoAnchorEl(null);
        setCurrentInfoFile(null);
        setAnnotationText("");
    };

    const infoOpen = Boolean(infoAnchorEl);

    const handleSaveAnnotation = () => {
        if (!onUpdateRecentFiles || !currentInfoFile) return;
        const updated = recentFiles.map((f) =>
            f.id === currentInfoFile.id ? { ...f, annotation: annotationText } : f,
        );
        onUpdateRecentFiles(updated);
        closeInfoPopover();
    };

    const handleLoad = (file) => {
        onFileLoad(file);
        handleClose();
    };



    const handleDelete = (fileId, e) => {
        e.stopPropagation(); // Prevent list item click
        if (!onUpdateRecentFiles) return;
        const updated = recentFiles.filter((f) => f.id !== fileId);
        onUpdateRecentFiles(updated);
    };

    const handleShare = async (file, e) => {
        e.stopPropagation();
        if (navigator.share) {
            try {
                await navigator.share({
                    title: file.fileName,
                    text: `Check out this file: ${file.fileName}`,
                    url: file.url || window.location.href,
                });
            } catch (err) {
                console.error("Error sharing:", err);
                alert("Sharing failed or was cancelled.");
            }
        } else {
            alert("Sharing is not supported in this browser.");
        }
    };

    const handleWhatsAppShare = (file, e) => {
        e.stopPropagation();
        const urlToShare = file.url || window.location.href;
        const text = `Check out this file: ${file.fileName} - ${urlToShare}`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(whatsappUrl, "_blank");
    };

    return (
        <>
            <Tooltip title="Recent Files" arrow><Fab
  aria-label="recent files"
  onClick={handleClick}
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
  <HistoryIcon />
</Fab>
</Tooltip>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                transformOrigin={{ vertical: "bottom", horizontal: "center" }}
                disableRestoreFocus
                sx={{ maxWidth: 460 }}
            >
                <Box sx={{ p: 2, maxWidth: 460, maxHeight: 400, overflow: "auto" }}>
                    <Typography variant="h6" gutterBottom>
                        Recently Edited Files
                    </Typography>
                    {(!recentFiles || recentFiles.length === 0) && (
  <Typography>No recent files found.</Typography>
)}
                    <List dense>
                        {recentFiles.map((file) => (
                            <React.Fragment key={file.id}>
                                <Tooltip
                                    title={file.annotation || ""}
                                    placement="right"
                                    arrow
                                    disableHoverListener={!file.annotation}
                                >
                                    <ListItem
                                        secondaryAction={
                                            <FileListItem
                                                file={file}
                                                handleOpenInfo={handleOpenInfo}
                                                handleShare={handleShare}
                                                handleDelete={handleDelete}
                                                handleWhatsAppShare={handleWhatsAppShare}
                                                onClick={() => handleLoad(file)}
                                            />
                                      
                                        }
                                        button
                                        onClick={() => handleLoad(file)}
                                        alignItems="flex-start"
                                        sx={{ cursor: "pointer", minWidth: 400 }}
                                    >
                                        <ListItemText
                                            primary={
                                                <Link
                                                    href={file.url || "#"}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    underline="hover"
                                                    onClick={(e) => e.stopPropagation()}
                                                    sx={{ wordBreak: "break-all" }}
                                                >
                                                    {file.fileName}
                                                </Link>
                                            }
                                            secondary={
                                                <Typography variant="body2" color="text.secondary" component="span">
                                                    Last edited: {formatDateTime(file.editedAt)}
                                                </Typography>
                                            }
                                        />

                                    </ListItem>
                                </Tooltip>
                                <Divider component="li" />
                            </React.Fragment>
                        ))}
                    </List>
                </Box>
            </Popover>

            {/* Annotation Popover */}
            <Popover
                open={infoOpen}
                anchorEl={infoAnchorEl}
                onClose={closeInfoPopover}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
                disableRestoreFocus
            >
                <Box sx={{ p: 2, maxWidth: 280, width: 280 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        Edit Annotation
                    </Typography>
                    <TextField
                        autoFocus
                        multiline
                        minRows={2}
                        maxRows={6}
                        fullWidth
                        variant="outlined"
                        value={annotationText}
                        onChange={(e) => setAnnotationText(e.target.value)}
                    />
                    <Box sx={{ mt: 1, display: "flex", justifyContent: "flex-end", gap: 1 }}>
                        <Button size="small" onClick={closeInfoPopover}>
                            Cancel
                        </Button>
                        <Button size="small" variant="contained" onClick={handleSaveAnnotation}>
                            Save
                        </Button>
                    </Box>
                </Box>
            </Popover>
        </>
    );
}
