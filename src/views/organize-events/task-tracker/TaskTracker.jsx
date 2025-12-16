import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Box, Typography, Paper, CircularProgress, Alert, Chip, Avatar
} from '@mui/material';
// Import DataGrid from the CDN-compatible 'esm' build
import { DataGrid } from '@mui/x-data-grid';
import {supabase } from '../../../libs/supabaseClient'


// Helper to render the status chip
const StatusChip = ({ status }) => {
  let color;
  switch (status) {
    case 'todo': color = 'error'; break;
    case 'in_progress': color = 'warning'; break;
    case 'done': color = 'success'; break;
    default: color = 'default';
  }
  return <Chip label={status} color={color} size="small" />;
};

export default function TaskTracker() {
  const { eventId } = useOutletContext();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const columns = [
    { field: 'title', headerName: 'Task', flex: 1, minWidth: 250 },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell: (params) => <StatusChip status={params.value} />,
    },
    {
      field: 'assigned_to',
      headerName: 'Assigned To',
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar 
            sx={{ width: 24, height: 24 }} 
            src={params.row.profiles?.avatar_url}
          />
          {params.row.profiles?.full_name || 'Unassigned'}
        </Box>
      ),
    },
    {
      field: 'due_date',
      headerName: 'Due Date',
      width: 150,
      type: 'date',
      valueGetter: (params) => params.value ? new Date(params.value) : null,
    },
  ];

  useEffect(() => {
    if (!eventId) return;

    const fetchTasks = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('tasks')
          .select(`
            *,
            profiles ( full_name, avatar_url )
          `)
          .eq('event_id', eventId); // <-- THE CRITICAL FILTER

        if (error) throw error;
        setTasks(data);
      } catch (err) {
        console.error('Error fetching tasks:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [eventId]);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
  }
  if (error) {
    return <Alert severity="error">Error loading tasks: {error}</Alert>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Event Task Tracker
      </Typography>
      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={tasks}
          columns={columns}
          loading={loading}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          pageSizeOptions={[10, 25, 50]}
        />
      </Paper>
    </Box>
  );
}