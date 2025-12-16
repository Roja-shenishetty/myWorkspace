import React from 'react';
import { Paper, Typography, Grid, Box } from '@mui/material';
import { AccountTree, FileUpload, Storage } from '@mui/icons-material';

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

const MetricItem = ({ icon, title, value }) => (
    <Grid item xs={12} sm={4} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ 
            backgroundColor: 'primary.light', 
            borderRadius: '50%', 
            p: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            {icon}
        </Box>
        <Box>
            <Typography variant="h6" component="p">{value}</Typography>
            <Typography variant="body2" color="text.secondary">{title}</Typography>
        </Box>
    </Grid>
);


export default function MetricsCard({ metrics }) {
  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
            Your Usage Overview
        </Typography>
      <Grid container spacing={2}>
        <MetricItem 
            icon={<AccountTree color="primary"/>} 
            title="Instances Created" 
            value={metrics.instance_count} 
        />
        <MetricItem 
            icon={<FileUpload color="primary"/>} 
            title="Files Uploaded" 
            value={metrics.file_upload_count} 
        />
        <MetricItem 
            icon={<Storage color="primary"/>} 
            title="Total Storage Used" 
            value={formatBytes(metrics.total_storage_bytes)} 
        />
      </Grid>
    </Paper>
  );
}
