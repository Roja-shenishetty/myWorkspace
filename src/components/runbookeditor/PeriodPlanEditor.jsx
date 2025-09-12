import { Box , Typography, TextField}from '@mui/material';

export default function PeriodPlanEditor({ periodPlan, onChange }) {
  const fields = ["prerequisites", "assessment", "pedagogy", "evaluation"];
  return (
    <Box mb={4}>
      <Typography variant="h6">Period Plan</Typography>
      {fields.map((field) => (
        <TextField
          key={field}
          label={field.charAt(0).toUpperCase() + field.slice(1)}
          value={periodPlan[field] || ""}
          onChange={(e) =>
            onChange({ ...periodPlan, [field]: e.target.value })
          }
          multiline
          fullWidth
          margin="normal"
        />
      ))}
    </Box>
  );
}