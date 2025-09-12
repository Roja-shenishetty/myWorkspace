import React, { useState } from "react";
import { Fab, Tooltip, Box } from "@mui/material";
import VideocamIcon from "@mui/icons-material/Videocam";
import CloseIcon from "@mui/icons-material/Close";

// Import your combined ScreenCameraRecorder component
import ScreenCameraRecorder from "./ScreenCameraRecorder";

export default function ScreenCameraRecorderFab({ onUpload }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Tooltip title={isOpen ? "Close Recorder" : "Open Screen+Cam Recorder"}>
        <Fab
          color={isOpen ? "secondary" : "primary"}
          aria-label="toggle screen camera recorder"
          onClick={() => setIsOpen((prev) => !prev)}
         
        >
          {isOpen ? <CloseIcon /> : <VideocamIcon />}
        </Fab>
      </Tooltip>

      {isOpen && (
        <Box
          sx={{
            position: "fixed",
            bottom: 96,
            right: 32,
            width: 320,
            bgcolor: "background.paper",
            boxShadow: 4,
            borderRadius: 2,
            p: 2,
            zIndex: 1300,
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          <ScreenCameraRecorder onUpload={onUpload} />
        </Box>
      )}
    </>
  );
}
