import { Box , Typography, TextField}from '@mui/material';
export default function MetadataEditor({ metadata, onChange }) {
  return (
    <Box mb={2}>
      <Typography variant="h6">Metadata</Typography>
      <TextField
        label="Topic Name"
        value={metadata.topicName}
        onChange={(e) => onChange("topicName", e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Topic Description"
        value={metadata.topicDescription}
        onChange={(e) => onChange("topicDescription", e.target.value)}
        multiline
        fullWidth
        margin="normal"
      />
      {/* Add inputs for tags, fileId, parentId, parentType similarly */}
    </Box>
  );
}


