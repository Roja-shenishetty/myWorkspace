import React, { useState, useRef } from "react";
import { Fab, Popover, Box, Typography, Button } from "@mui/material";
import RestartAlt from "@mui/icons-material/RestartAlt";

export default function ClearLocalStorageWithConfirm({ onClear }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const buttonRef = useRef(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleConfirmClear = () => {
    handleClose();
    onClear();
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Fab
        color="secondary"
        aria-label="clear local storage"
        onClick={handleClick}
        ref={buttonRef}
        
      >
        <RestartAlt />
      </Fab>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        transformOrigin={{ vertical: "bottom", horizontal: "center" }}
        disableRestoreFocus
      >
        <Box sx={{ p: 2, maxWidth: 220 }}>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to clear saved data?
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button size="small" onClick={handleClose}>Cancel</Button>
            <Button 
              size="small" 
              color="error" 
              variant="contained" 
              onClick={handleConfirmClear}
            >
              Clear
            </Button>
          </Box>
        </Box>
      </Popover>
    </>
  );
}
