import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import React from 'react';

export default function TeachingPlanEditor({ open, onClose, teachingPlan, onSave }) {
  const [localPlan, setLocalPlan] = React.useState(teachingPlan || {});

  React.useEffect(() => {
    setLocalPlan(teachingPlan || {});
  }, [teachingPlan]);

  const fields = ["prerequisites", "assessment", "pedagogy", "evaluation"];

  const handleChange = (field) => (e) => {
    setLocalPlan((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSaveClick = () => {
    onSave(localPlan);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Teaching Plan</DialogTitle>
      <DialogContent>
        {fields.map((field) => (
          <TextField
            key={field}
            label={field.charAt(0).toUpperCase() + field.slice(1)}
            value={localPlan[field] || ""}
            onChange={handleChange(field)}
            multiline
            fullWidth
            margin="normal"
          />
        ))}
        <Box textAlign="right" mt={2}>
          <Button onClick={onClose} sx={{ mr: 1 }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSaveClick}>
            Save
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
