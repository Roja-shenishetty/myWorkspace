import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box, Typography, Grid, Card, CardContent,
  CardActionArea, CircularProgress, Alert
} from '@mui/material';
import { supabase } from '../../libs/supabaseClient';



// This is the page at /events
// It lists all available events to choose from.
export default function EventDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Fetch from your 'events' master table
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('date', { ascending: false });

        if (error) throw error;
        setEvents(data);
      } catch (err) {
        console.error('Error fetching events:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
  }
  if (error) {
    return <Alert severity="error">Error loading events: {error}</Alert>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Alumni Event Dashboard
      </Typography>
      <Typography variant="body1" gutterBottom>
        Please select an event to manage or view its details.
      </Typography>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {events.map((event) => (
          <Grid item xs={12} sm={6} md={4} key={event.id}>
            <Card>
              {/* This CardActionArea links to the specific event's layout */}
              <CardActionArea component={RouterLink} to={`/events/${event.id}`}>
                {/* You can add a CardMedia here with event.image_url */}
                <CardContent>
                  <Typography variant="h6">{event.name}</Typography>
                  <Typography color="textSecondary">
                    {new Date(event.date).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {event.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}