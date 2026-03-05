import React, { useState, useRef } from "react";
import { Fab, Popover, Box, Typography, Button,Tooltip } from "@mui/material";
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
    <Tooltip title="Clear Local" arrow>
      <Fab
  aria-label="clear local storage"
  onClick={handleClick}
  ref={buttonRef}
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
  <RestartAlt />
</Fab>
</Tooltip>
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
