import { Box } from '@mui/material';
import SchemaBuilderTree from './SchemaBuilderTree'

export default function NodeTypeEditorFullApp() {
 
  return (
    <Box sx={{
      display: 'flex',
      gap: 3,
      minHeight: 420,
      p: 3,
      bgcolor: 'grey.100'
    }}>      
      <SchemaBuilderTree></SchemaBuilderTree>      
    </Box>
  );
}
