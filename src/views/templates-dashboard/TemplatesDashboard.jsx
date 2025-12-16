import React from 'react';
import { Box, Typography, Grid, Button, Paper } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import MetricsCard from './MetricsCard';
import TemplateList from './TemplateList';
import InstanceList from './InstanceList';

// MOCK DATA - In a real app, this would come from Supabase calls
const mockUserMetrics = {
  instance_count: 8,
  file_upload_count: 42,
  total_storage_bytes: 1120442, // Approx 1.12 MB
};

const mockUserTemplates = [
  { id: 1, name: 'Development Plan Q4' },
  { id: 2, name: 'Client Onboarding - Acme Inc.' },
  { id: 3, name: 'Blog Post Draft' },
];

const mockGlobalTemplates = [
  { id: 101, name: 'Standard Project Plan' },
  { id: 102, name: 'Quarterly Financial Report' },
];

const mockUserInstances = [
    {id: 1, name: 'My Q4 2025 Goals', templateName: 'Development Plan Q4'},
    {id: 2, name: 'Final Report', templateName: 'Quarterly Financial Report'},
];

const mockSharedInstances = [
    {id: 201, name: 'Project Alpha Plan', sharedBy: 'colleague@example.com'},
];


export default function TemplatesDashboard() {
  // In a real app, you would have a loading state
  // const { data, loading, error } = useFetchDashboardData();

  return (
    <Box sx={{ flexGrow: 1, p: 3, backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome Back!
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} size="large">
          New Template
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* User Metrics */}
        <Grid item xs={12}>
          <MetricsCard metrics={mockUserMetrics} />
        </Grid>
        
        {/* My Templates */}
        <Grid item xs={12} md={6}>
            <TemplateList title="My Templates" templates={mockUserTemplates} />
        </Grid>

        {/* Global Templates */}
        <Grid item xs={12} md={6}>
            <TemplateList title="Global Templates" templates={mockGlobalTemplates} isGlobal={true} />
        </Grid>
        
        {/* My Instances */}
        <Grid item xs={12} md={6}>
            <InstanceList title="My Instances" instances={mockUserInstances} />
        </Grid>

        {/* Shared Instances */}
        <Grid item xs={12} md={6}>
            <InstanceList title="Shared With Me" instances={mockSharedInstances} isShared={true} />
        </Grid>

      </Grid>
    </Box>
  );
}
