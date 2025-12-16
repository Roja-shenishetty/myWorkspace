import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Box, Button, Typography, Paper, CircularProgress,
  FormControl, FormLabel, RadioGroup, FormControlLabel, Radio,
  TextField, IconButton, Collapse, Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {supabase } from '../../../libs/supabaseClient'

// --- End Supabase Client Setup ---

export default function RsvpPage() {
  const { eventId } = useOutletContext();
  
  const [isAttending, setIsAttending] = useState('no');
  const [familyMembers, setFamilyMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [existingRsvpId, setExistingRsvpId] = useState(null);

  useEffect(() => {
    if (!eventId) return;

    const fetchUserRsvp = async () => {
      try {
        setFetchLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not found');

        const { data, error } = await supabase
          .from('attendees')
          .select('*')
          .eq('user_id', user.id)
          .eq('event_id', eventId) // <-- THE CRITICAL FILTER
          .limit(1)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
          throw error;
        }

        if (data) {
          setExistingRsvpId(data.id);
          setIsAttending(data.is_attending ? 'yes' : 'no');
          setFamilyMembers(data.family_members || []);
        } else {
          // Reset form if no data found for this event
          setExistingRsvpId(null);
          setIsAttending('no');
          setFamilyMembers([]);
        }
      } catch (error) {
        console.error('Error fetching RSVP:', error.message);
      } finally {
        setFetchLoading(false);
      }
    };

    fetchUserRsvp();
  }, [eventId]); // Re-fetch when eventId changes

  const handleAddMember = () => {
    setFamilyMembers([...familyMembers, { name: '', relation: '' }]);
  };

  const handleRemoveMember = (index) => {
    const newList = familyMembers.filter((_, i) => i !== index);
    setFamilyMembers(newList);
  };

  const handleMemberChange = (index, field, value) => {
    const newList = [...familyMembers];
    newList[index][field] = value;
    setFamilyMembers(newList);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not found');

      const attending = isAttending === 'yes';
      const finalFamilyMembers = attending ? familyMembers : [];
      const totalCount = attending ? 1 + finalFamilyMembers.length : 0;

      const rsvpData = {
        user_id: user.id,
        event_id: eventId, // <-- THE CRITICAL ADDITION
        is_attending: attending,
        family_members: finalFamilyMembers,
        total_count: totalCount
      };

      if (existingRsvpId) {
        // UPDATE
        const { error } = await supabase
          .from('attendees')
          .update(rsvpData)
          .eq('id', existingRsvpId);
        if (error) throw error;
      } else {
        // INSERT
        const { data, error } = await supabase
          .from('attendees')
          .insert(rsvpData)
          .select()
          .single();
        if (error) throw error;
        if (data) setExistingRsvpId(data.id);
      }

      alert('RSVP saved successfully!');
    } catch (error) {
      console.error('Error saving RSVP:', error.message);
      alert('Error saving RSVP: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box sx={{ p: 3, maxWidth: 600, margin: 'auto' }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Event RSVP & Family Registry
        </Typography>

        <FormControl component="fieldset" margin="normal">
          <FormLabel component="legend">Are you attending this event?</FormLabel>
          <RadioGroup row value={isAttending} onChange={(e) => setIsAttending(e.target.value)}>
            <FormControlLabel value="yes" control={<Radio />} label="Yes, I'll be there!" />
            <FormControlLabel value="no" control={<Radio />} label="No, I can't make it" />
          </RadioGroup>
        </FormControl>

        <Collapse in={isAttending === 'yes'}>
          <Typography variant="h6" sx={{ mt: 3 }}>
            Family Members Attending With You
          </Typography>
          
          {familyMembers.map((member, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
              <TextField
                label="Full Name"
                variant="outlined"
                size="small"
                value={member.name}
                onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                sx={{ flex: 1 }}
              />
              <TextField
                label="Relation"
                variant="outlined"
                size="small"
                value={member.relation}
                onChange={(e) => handleMemberChange(index, 'relation', e.target.value)}
                sx={{ flex: 1 }}
              />
              <IconButton onClick={() => handleRemoveMember(index)} color="error">
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}

          <Button
            startIcon={<AddIcon />}
            onClick={handleAddMember}
            variant="text"
            sx={{ mt: 1 }}
          >
            Add Family Member
          </Button>
          <Divider sx={{ my: 3 }} />
          <Typography variant="h6">
            Total Count: {1 + familyMembers.length}
          </Typography>
        </Collapse>

        <Box sx={{ mt: 3, textAlign: 'right' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading}
            size="large"
          >
            {loading ? <CircularProgress size={24} /> : 'Save RSVP'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}