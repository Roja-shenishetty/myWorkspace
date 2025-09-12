import React, { useState } from "react";
import {Paper, Box } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Popover from "@mui/material/Popover";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import InfoIcon from "@mui/icons-material/Info";
import SaveIcon from "@mui/icons-material/Save";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";

// Example metadata state
const initialMetadata = {
    description: "",
    tags: "",
    subject: "",
    filename: "runbook"
};

export default function FileAppBar({ onOpenFile, onSaveFile, offset, currentFileName }) {
    const [metadata, setMetadata] = useState(initialMetadata);
    const [anchorEl, setAnchorEl] = useState(null);

    // Handle Popover open
    const handleMetadataClick = event => setAnchorEl(event.currentTarget);
    const handleMetadataClose = () => setAnchorEl(null);

    // Save Metadata Function
    const handleSaveMetadata = () => {
        const { filename, ...rest } = metadata;
        const json = JSON.stringify(rest, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const metaFilename = `${filename || "unnamed"}.metadata.json`;

        const link = document.createElement("a");
        link.href = url;
        link.download = metaFilename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        handleMetadataClose();
    };

    const fileInputRef = React.useRef(null);

const handleFileIconClick = () => {
  if (fileInputRef.current) {
    fileInputRef.current.click();
  }
};

const handleFileChange = (event) => {
  if (event.target.files && event.target.files[0]) {
    onOpenFile && onOpenFile(event.target.files);
  }
};


    return (
        <>
            <Paper elevation={2} sx={{position:"fixed", width:"100%", zIndex:2, top: offset }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        {currentFileName ? `Runbook: ${currentFileName}` : 'Runbook Editor'}
                    </Typography>

                    <Tooltip title="Open File">
                        <IconButton color="primary" onClick={onOpenFile}>
                            <FolderOpenIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Save Sections">
                        <IconButton color="primary" onClick={onSaveFile}>
                            <SaveIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Metadata">
                        <IconButton color="primary" onClick={handleMetadataClick}>
                            <InfoIcon />
                        </IconButton>
                    </Tooltip>
                </Toolbar>
            </Paper>
            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleMetadataClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
            >
                <form style={{ padding: 24, minWidth: 300 }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Metadata
                    </Typography>
                    <TextField
                        label="Description"
                        value={metadata.description}
                        onChange={e => setMetadata({ ...metadata, description: e.target.value })}
                        fullWidth
                        multiline
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Tags"
                        value={metadata.tags}
                        onChange={e => setMetadata({ ...metadata, tags: e.target.value })}
                        fullWidth
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Subject"
                        value={metadata.subject}
                        onChange={e => setMetadata({ ...metadata, subject: e.target.value })}
                        fullWidth
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Filename"
                        value={metadata.filename}
                        onChange={e => setMetadata({ ...metadata, filename: e.target.value })}
                        fullWidth
                        sx={{ mb: 2 }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<SaveIcon />}
                        onClick={handleSaveMetadata}
                        fullWidth
                    >
                        Save Metadata
                    </Button>
                </form>
            </Popover>
            {/* Spacer (keep content below fixed AppBar) */}
            <div style={{ height: 64 }} />
        </>
    );
}
