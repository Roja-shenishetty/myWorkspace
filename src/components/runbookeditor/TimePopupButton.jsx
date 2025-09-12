import React, {useState, useRef} from "react";
import { Box, Typography, Slider, InputAdornment, TextField, IconButton,Popover } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CloseIcon from "@mui/icons-material/Close";

const MIN = 0;
const MAX = 90;

export default function TimePopupButton({ timeToRead, timeToRun, onChange }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <Box>
      <IconButton onClick={handleClick} aria-label="Set time controls">
        <AccessTimeIcon />
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <Box sx={{ p: 2, minWidth: 280 }}>
         <IconButton
      aria-label="Close"
      onClick={handleClose}
      sx={{
        position: "absolute",
        top: 4,
        right: 4,
        zIndex: 1
      }}
    >
      <CloseIcon fontSize="small" />
    </IconButton>
          <TimeToReadRunSlider
            timeToRead={timeToRead}
            timeToRun={timeToRun}
            onChange={onChange}
          />
        </Box>
      </Popover>
    </Box>
  );
}

function TimeSlider({ label, value, onChange }) {
  const handleSliderChange = (e, newVal) => {
    onChange(Math.max(MIN, Math.min(MAX, newVal)));
  };

  const handleInputChange = (e) => {
    const val = Number(e.target.value) || 0;
    onChange(Math.max(MIN, Math.min(MAX, val)));
  };

  return (
    <Box sx={{ width: "auto", mb: 2 }}>
      <Typography gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <AccessTimeIcon fontSize="small" /> {label}
      </Typography>
      <Slider
        value={value ?? MIN}
        onChange={handleSliderChange}
        aria-label={`${label}-slider`}
        valueLabelDisplay="auto"
        step={1}
        marks
        min={MIN}
        max={MAX}
      />
      <TextField
        value={value ?? MIN}
        onChange={handleInputChange}
        inputProps={{
          step: 1,
          min: MIN,
          max: MAX,
          type: "number",
          "aria-label": `${label}-input`,
        }}
        size="small"
        sx={{ mt: 1, width: 120 }}
        InputProps={{
          endAdornment: <InputAdornment position="end">min</InputAdornment>,
        }}
      />
    </Box>
  );
}

  function TimeToReadRunSlider({ timeToRead, timeToRun, onChange }) {
  return (
     

    <Box display="flex" gap={3} flexWrap="wrap" sx={{ p: 2, width: 'auto', minWidth: 0, maxWidth: '100%' }}>
      <TimeSlider
        label="Time to Read"
        value={timeToRead}
        onChange={(val) => onChange("timeToRead", val)}
      />
      <TimeSlider
        label="Time to Run"
        value={timeToRun}
        onChange={(val) => onChange("timeToRun", val)}
      />
    </Box>
  );
}