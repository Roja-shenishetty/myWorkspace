import React, { useState } from "react";
import { Paper, Box, Drawer,Stack } from "@mui/material";
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
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import AppBar from "@mui/material/AppBar";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider
} from "@mui/material";

// Example metadata state
const initialMetadata = {
    description: "",
    tags: "",
    subject: "",
    filename: "runbook"
};
  
export default function FileAppBar({ onOpenFile, onSaveFile, setHideUI, hideUI, drawerOpen, setDrawerOpen  }) {
  
const sideIcons = {
  borderRadius: "10px",
  mb: 1,
  px: 1,
  "& .MuiListItemIcon-root": {
    minWidth: 40,
    color: "#374151",
  },
  "& .MuiSvgIcon-root": {
    fontSize: 20,
  },
  "&:hover": {
    backgroundColor: "#f3f4f6",
  },
};
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

    
    return (
        <>
            <AppBar
  position="fixed"
  color="default"
  elevation={1}
>
                
  <Toolbar>
    <IconButton onClick={() => setDrawerOpen(!drawerOpen)}>
  {drawerOpen ? <CloseIcon /> : <MenuIcon />}
</IconButton>
  </Toolbar>
</AppBar>
      
                    {/* Sidebar Drawer */}
  <Drawer
  anchor="left"
  open={drawerOpen}
  onClose={() => setDrawerOpen(false)}
>
  <Box sx={{ width: 250, height: "100%" }}>
<Box
  sx={{
    display: "flex",
    justifyContent: "flex-end",
    p: 1
  }}
>
  <IconButton onClick={() => setDrawerOpen(false)}>
    <CloseIcon />
  </IconButton>
</Box>
    <List>

      <ListItemButton sx={sideIcons} onClick={() => {
        onOpenFile?.();
        setDrawerOpen(false);
      }}>
        <ListItemIcon>
          <FolderOpenIcon />
        </ListItemIcon>
        <ListItemText primary="Open File" />
      </ListItemButton>

     <ListItemButton
  sx={sideIcons}
  onClick={onOpenFile}
>
        <ListItemIcon>
          <SaveIcon />
        </ListItemIcon>
        <ListItemText primary="Save Sections" />
      </ListItemButton>

      <ListItemButton sx={sideIcons} onClick={handleMetadataClick}>
        <ListItemIcon>
          <InfoIcon />
        </ListItemIcon>
        <ListItemText primary="Edit Metadata" />
      </ListItemButton>

      <Divider />

      <ListItemButton sx={sideIcons} onClick={() => setHideUI(!hideUI)}>
        <ListItemIcon>
          {hideUI ? <VisibilityIcon /> : <VisibilityOffIcon />}
        </ListItemIcon>
        <ListItemText
          primary={hideUI ? "Show UI" : "Hide UI"}
        />
      </ListItemButton>

    </List>

  </Box>
</Drawer>
      
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
