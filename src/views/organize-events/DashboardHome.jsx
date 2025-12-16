// DashboardHome.js
import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient'; // Make sure path is correct
import { Link as RouterLink } from 'react-router-dom';
import {
  Grid, Paper, Typography, Box, List, ListItem, ListItemText,
  Divider, Button, CircularProgress, Alert, Avatar
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';

export default function DashboardHome() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    profile: null,
    rsvp: null,
    events: [],
    tasks: [],
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not found');

        const now = new Date().toISOString();

        // Use Promise.all to fetch everything in parallel
        const [profileRes, rsvpRes, eventsRes, tasksRes] = await Promise.all([
          supabase.from('profiles').select('*').eq('id', user.id).single(),
          supabase.from('attendees').select('*').eq('user_id', user.id).single(),
          supabase.from('events').select('*').gte('start_time', now).order('start_time', { ascending: true }).limit(3),
          supabase.from('tasks').select('title').eq('assigned_to_user_id', user.id).eq('status', 'in_progress').limit(3)
        ]);

        setDashboardData({
          profile: profileRes.data,
          rsvp: rsvpRes.data,
          events: eventsRes.data,
          tasks: tasksRes.data,
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
  }
  if (error) {
    return <Alert severity="error">Error loading dashboard: {error}</Alert>;
  }

  const { profile, rsvp, events, tasks } = dashboardData;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome, {profile?.full_name || 'Alumni'}!
      </Typography>

      <Grid container spacing={3}>
        {/* RSVP Widget */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>My RSVP</Typography>
            {rsvp ? (
              <Box>
                <Typography>Status: <strong style={{ color: 'green' }}>Confirmed</strong></Typography>
                <Typography>Total in your group: <strong>{rsvp.total_count}</strong></Typography>
                <Button component={RouterLink} to="/rsvp" sx={{ mt: 1 }}>Update RSVP</Button>
              </Box>
            ) : (
              <Box>
                <Typography>You haven't RSVP'd yet!</Typography>
                <Button component={RouterLink} to="/rsvp" variant="contained" sx={{ mt: 1 }}>RSVP Now</Button>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* My Tasks Widget */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>My Open Tasks</Typography>
            {tasks.length > 0 ? (
              <List dense>
                {tasks.map(task => (
                  <ListItem key={task.title}><ListItemText primary={task.title} /></ListItem>
                ))}
              </List>
            ) : (
              <Typography>No open tasks. You're all set!</Typography>
            )}
            <Button component={RouterLink} to="/tasks" sx={{ mt: 1 }}>View All Tasks</Button>
          </Paper>
        </Grid>

        {/* Upcoming Events Widget */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Upcoming Events</Typography>
            {events.length > 0 ? (
              <List>
                {events.map(event => (
                  <ListItem key={event.id}>
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}><EventIcon /></Avatar>
                    <ListItemText
                      primary={event.title}
                      secondary={`${new Date(event.start_time).toLocaleString()} - ${event.description}`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography>No upcoming events. Check back soon!</Typography>
            )}
            <Button component={RouterLink} to="/calendar" sx={{ mt: 1 }}>View Full Calendar</Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}