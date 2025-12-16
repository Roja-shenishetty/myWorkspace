import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useOutletContext } from 'react-router-dom';
import {
  Grid, Paper, Typography, Box, List, ListItem, ListItemText,
  Button, CircularProgress, Alert, Avatar
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import {supabase } from '../../libs/supabaseClient'

// --- End Supabase Client Setup ---

// This is the page at /events/:eventId
// It's the main dashboard for a *single* selected event.
export default function EventHome() {
  // Get the eventId from the parent layout (EventModuleLayout)
  const { eventId } = useOutletContext();
  
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    event: null,
    rsvp: null,
    tasks: [],
    schedule: [],
  });
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Don't run if eventId isn't loaded yet
    if (!eventId) return;

    const fetchDashboardData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not found');
        setUserId(user.id);

        const now = new Date().toISOString();

        // Use Promise.all to fetch everything in parallel
        const [eventRes, rsvpRes, scheduleRes, tasksRes] = await Promise.all([
          supabase.from('events').select('name').eq('id', eventId).single(),
          supabase.from('attendees').select('total_count').eq('user_id', user.id).eq('event_id', eventId).single(),
          supabase.from('schedule_items').select('*').eq('event_id', eventId).gte('start_time', now).order('start_time', { ascending: true }).limit(3),
          supabase.from('tasks').select('title').eq('assigned_to_user_id', user.id).eq('event_id', eventId).eq('status', 'in_progress').limit(3)
        ]);

        setDashboardData({
          event: eventRes.data,
          rsvp: rsvpRes.data,
          schedule: scheduleRes.data,
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
  }, [eventId]); // Re-run if eventId changes

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
  }
  if (error) {
    return <Alert severity="error">Error loading dashboard: {error}</Alert>;
  }

  const { event, rsvp, schedule, tasks } = dashboardData;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {event?.name || 'Event Dashboard'}
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
                <Button component={RouterLink} to={`/events/${eventId}/rsvp`} sx={{ mt: 1 }}>Update RSVP</Button>
              </Box>
            ) : (
              <Box>
                <Typography>You haven't RSVP'd for this event yet!</Typography>
                <Button component={RouterLink} to={`/events/${eventId}/rsvp`} variant="contained" sx={{ mt: 1 }}>RSVP Now</Button>
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
                {tasks.map((task, index) => (
                  <ListItem key={index}><ListItemText primary={task.title} /></ListItem>
                ))}
              </List>
            ) : (
              <Typography>No open tasks. You're all set!</Typography>
            )}
            <Button component={RouterLink} to={`/events/${eventId}/tasks`} sx={{ mt: 1 }}>View All Tasks</Button>
          </Paper>
        </Grid>

        {/* Upcoming Events Widget */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Upcoming Schedule</Typography>
            {schedule.length > 0 ? (
              <List>
                {schedule.map(item => (
                  <ListItem key={item.id}>
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}><EventIcon /></Avatar>
                    <ListItemText
                      primary={item.title}
                      secondary={`${new Date(item.start_time).toLocaleString()} - ${item.description}`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography>No upcoming items on the schedule.</Typography>
            )}
            <Button component={RouterLink} to={`/events/${eventId}/calendar`} sx={{ mt: 1 }}>View Full Calendar</Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}