import { Box, TextField } from "@mui/material";
export function UserDetailsStep({ data = {}, onChange, errors }) {
  return (
    <Box>
      <TextField
        label="First Name"
        required
        fullWidth
        margin="normal"
        value={data.firstName || ""}
        onChange={(e) => onChange({ ...data, firstName: e.target.value })}
        error={!!errors.firstName}
        helperText={errors.firstName}
      />
      <TextField
        label="Last Name"
        required
        fullWidth
        margin="normal"
        value={data.lastName || ""}
        onChange={(e) => onChange({ ...data, lastName: e.target.value })}
        error={!!errors.lastName}
        helperText={errors.lastName}
      />
    </Box>
  );
}

// Sample validator
export function validateUserDetails(data) {
  const errors = {};
  if (!data.firstName) errors.firstName = "First name is required";
  if (!data.lastName) errors.lastName = "Last name is required";
  return errors;
}
