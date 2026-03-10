import React, { useState } from "react";

import {
  Paper,
  Box,
  Drawer,
  Stack,
  Fab,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Popover,
  TextField,
  Button,
  Tooltip,
  AppBar
} from "@mui/material";

import InfoIcon from "@mui/icons-material/Info";
import SaveIcon from "@mui/icons-material/Save";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";

import RestartAltIcon from "@mui/icons-material/RestartAlt";
import RecentFilesPopup from "../../runbookeditor/RecentFilesPopup";
import ClearLocalStorageWithConfirm from "../../runbookeditor/ClearLocalStorageWithConfirm";
import FavouritesPopup from "../FavouritesTree/FavouritesPopup";

import ScreenRecorder from "../ScreenRecorder/ScreenRecorder";
import ScreenRecorderFab from "../ScreenRecorder/ScreenRecorderFab";

import YouTubeUploader from "../YouTubeUploader/YouTubeUploader";
import YouTubeUploaderFab from "../YouTubeUploader/YouTubeUploaderFab";

import ScreenCameraRecorderFab from "../CameraRecorder/ScreenCameraRecorderFab";
import titles from "../../../../data/titles.json";
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
const minimalFab = {
  width: { xs: 26, sm: 38 },
  height: { xs: 26, sm: 38 },
  minHeight: "unset",
  backgroundColor: "#ffffff",
  color: "#374151",
  borderRadius: "6px",
  border: "1px solid #e5e7eb",
  boxShadow: "none",
  transition: "all 0.18s ease",

  "&:hover": {
    backgroundColor: "#f3f4f6",
    transform: "translateY(-1px)",
    boxShadow: "0 3px 8px rgba(0,0,0,0.06)"
  },

  "&:active": {
    transform: "translateY(0px)",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
  }
};
  
export default function FileAppBar({
currentFileName,
onOpenFile,
setHideUI,
hideUI,
drawerOpen,
setDrawerOpen,
handleSaveFile,
handleShowPreview,
handleClearLocal,
recentFiles,
handleLoadRecentFile,
updateRecentFiles,
handleLoadSectionsJSON,
handleAddSection,
tab,
handleShowEdit
   }) {

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
<Stack
  direction="row"
    alignItems="center"
     spacing={{ xs: 0, sm: 1, md: 2, lg: 3 }}
    sx={{
      width: "100%",
      // justifyContent: "space-between"
    }}
>
    <IconButton onClick={() => setDrawerOpen(!drawerOpen)}>
  {drawerOpen ? <CloseIcon /> : <MenuIcon />}
</IconButton>
                 {/* ========== FILE GROUP ========== */}
<Box sx={{display: "flex", gap: 0.8, alignItems: "center" }}>
    <Tooltip title="Import JSON" arrow>
  <Fab component="label" sx={minimalFab}>
    <FolderOpenIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />
    <input
      type="file"
      accept="application/json"
      hidden
      onChange={handleLoadSectionsJSON}
    />
  </Fab>
</Tooltip>

   <Tooltip title="Save (Ctrl+S)" arrow>
  <Fab
   onClick={handleSaveFile ?? (() => {})}
    sx= {minimalFab}
  >
    <SaveIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />
  </Fab>
</Tooltip>

    <Divider orientation="vertical" flexItem />

    {/* ========== MEDIA GROUP ========== */}

    <ScreenRecorderFab position="static"></ScreenRecorderFab>
    <YouTubeUploaderFab/>

    <Divider orientation="vertical" flexItem />

    {/* ========== SYSTEM GROUP ========== */}

    <RecentFilesPopup
      recentFiles={recentFiles}
      onFileLoad={handleLoadRecentFile}
      onUpdateRecentFiles={updateRecentFiles}
    />
    <ClearLocalStorageWithConfirm onClear={handleClearLocal}/>

    {/* Right side buttons with tooltip and minimalFab style */}
     <Divider orientation="vertical" flexItem />
<Tooltip title="Add Section" arrow>
  <Fab
    color="primary"
    onClick={handleAddSection}
    sx={minimalFab}
  >
    <AddIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />
  </Fab>
</Tooltip>

<Tooltip title={tab === 0 ? "Preview" : "Edit"} arrow>
  <Fab
    color="primary"
    onClick={tab === 0 ? handleShowPreview : handleShowEdit}
    sx={minimalFab}
  >
    {tab === 0 ? (
      <VisibilityIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />
    ) : (
      <EditIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />
    )}
  </Fab>
</Tooltip>
</Box>
  </Stack>
  
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
<Typography
      variant="h6" // or h5 for slightly larger
      sx={{
        px: 1,                // horizontal padding
        py: 1,                // vertical padding
        mb:2,             // margin-bottom to separate from timeline
        borderRadius: 1,      // rounded corners
        bgcolor: "#f3f4f6",   // light gray background
        color: "#111827",     // dark text color
        fontWeight: 600,      // semi-bold
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)", // subtle shadow
      }}
    >{currentFileName || "Runbook Editor"}
    </Typography>


      <ListItemButton sx={sideIcons} onClick={() => {
        onOpenFile?.();
        setDrawerOpen(false);
      }}>
        <ListItemIcon>
          <FolderOpenIcon />
        </ListItemIcon>
        <ListItemText primary="Import JSON" />
      </ListItemButton>

     <ListItemButton
  sx={sideIcons}
  onClick={onOpenFile}
>
        <ListItemIcon>
          <SaveIcon />
        </ListItemIcon>
        <ListItemText primary="Save File" />
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
          primary={hideUI ? "Exit Preview" : "Print Preview"}
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
                   <IconButton
    onClick={() => setAnchorEl(null)}
    sx={{
      position: "absolute",
      top: 8,
      right: 8
    }}
  >
    <CloseIcon />
  </IconButton>
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
