import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Box, Typography, Paper, CircularProgress, Alert, Grid,
  Card, CardContent, CardActions, Button, Avatar, Dialog,
  DialogActions, DialogContent, DialogContentText, DialogTitle,
  TextField, List, ListItem, ListItemAvatar, ListItemText, Divider
} from '@mui/material';

import {supabase } from '../../../libs/supabaseClient'


// --- Write Message Dialog ---
function WriteMessageDialog({ open, onClose, profile, currentUser, eventId }) {
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!message) return;
    try {
      setSubmitting(true);
      const { error } = await supabase
        .from('recognitions')
        .insert({
          event_id: eventId, // <-- THE CRITICAL ADDITION
          author_user_id: currentUser.id,
          subject_user_id: profile.id,
          message: message,
          is_approved: false 
        });
      if (error) throw error;
      alert('Message submitted for approval!');
      onClose();
      setMessage('');
    } catch (error) {
      alert('Error submitting message.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Write about {profile?.full_name}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          Share a memory for this event. (All messages will be reviewed).
        </DialogContentText>
        <TextField autoFocus margin="dense" label="Your message" type="text" fullWidth multiline rows={4} value={message} onChange={(e) => setMessage(e.target.value)} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={submitting}>
          {submitting ? <CircularProgress size={24} /> : 'Submit'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// --- View Messages Dialog ---
function ViewMessagesDialog({ open, onClose, profile, eventId }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && profile && eventId) {
      const fetchMessages = async () => {
        setLoading(true);
        try {
          const { data, error } = await supabase
            .from('recognitions')
            .select(`*, profiles:author_user_id ( full_name, avatar_url )`)
            .eq('subject_user_id', profile.id)
            .eq('event_id', eventId) // <-- THE CRITICAL FILTER
            .eq('is_approved', true);
          if (error) throw error;
          setMessages(data);
        } catch (error) {
          console.error('Error fetching messages:', error.message);
        } finally {
          setLoading(false);
        }
      };
      fetchMessages();
    }
  }, [open, profile, eventId]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Messages for {profile?.full_name}</DialogTitle>
      <DialogContent dividers>
        {loading ? <CircularProgress /> : messages.length === 0 ? (
          <Typography>No messages yet.</Typography>
        ) : (
          <List>
            {messages.map((msg) => (
              <React.Fragment key={msg.id}>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar><Avatar src={msg.profiles?.avatar_url} /></ListItemAvatar>
                  <ListItemText
                    primary={msg.profiles?.full_name}
                    secondary={msg.message}
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions><Button onClick={onClose}>Close</Button></DialogActions>
    </Dialog>
  );
}

// --- Main Page Component ---
export default function RecognizeFriendPage() {
  const { eventId } = useOutletContext();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [writeDialogOpen, setWriteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);

  useEffect(() => {
    if (!eventId) return;

    const fetchAllData = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('You must be logged in.');
        setCurrentUser(user);

        // Fetch all profiles *except* the current user
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .neq('id', user.id); 
        if (error) throw error;
        setProfiles(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [eventId]); // Re-fetch if eventId changes

  const handleOpenWrite = (profile) => { setSelectedProfile(profile); setWriteDialogOpen(true); };
  const handleOpenView = (profile) => { setSelectedProfile(profile); setViewDialogOpen(true); };
  const handleClose = () => { setSelectedProfile(null); setWriteDialogOpen(false); setViewDialogOpen(false); };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Recognize Your Friend
      </Typography>
      <Grid container spacing={3}>
        {profiles.map((profile) => (
          <Grid item xs={12} sm={6} md={4} key={profile.id}>
            <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Avatar src={profile.avatar_url} sx={{ width: 80, height: 80, margin: 'auto', mb: 2 }} />
                <Typography variant="h6">{profile.full_name}</Typography>
                <Typography color="textSecondary">Class of {profile.class_year || 'N/A'}</Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', p: 2 }}>
                <Button size="small" variant="outlined" onClick={() => handleOpenView(profile)}>
                  View Messages
                </Button>
                <Button size="small" variant="contained" onClick={() => handleOpenWrite(profile)}>
                  Write Something
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {selectedProfile && (
        <WriteMessageDialog 
          open={writeDialogOpen}
          onClose={handleClose}
          profile={selectedProfile}
          currentUser={currentUser}
          eventId={eventId} // Pass eventId
        />
      )}
      {selectedProfile && (
        <ViewMessagesDialog 
          open={viewDialogOpen}
          onClose={handleClose}
          profile={selectedProfile}
          eventId={eventId} // Pass eventId
        />
      )}
    </Box>
  );
}