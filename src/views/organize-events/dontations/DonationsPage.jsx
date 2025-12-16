import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Box, Typography, Button, Paper, Table, TableBody,
  TableCell, TableHead, TableRow, CircularProgress, Chip, Dialog,
  DialogActions, DialogContent, DialogTitle, TextField
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { v4 as uuidv4 } from 'uuid';

import {supabase } from '../../../libs/supabaseClient'

// --- End Supabase Client Setup ---

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
  height: 1,
});

export default function DonationsPage() {
  const { eventId } = useOutletContext();
  
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchUserDonations = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not found');

      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .eq('user_id', user.id)
        .eq('event_id', eventId) // <-- THE CRITICAL FILTER
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDonations(data);
    } catch (error) {
      console.error('Error fetching donations:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (eventId) {
      fetchUserDonations();
    }
  }, [eventId]);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setAmount('');
    setFile(null);
  };
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file || !amount) {
      alert('Please fill in the amount and upload a screenshot.');
      return;
    }

    try {
      setSubmitting(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not found');

      const fileExt = file.name.split('.').pop();
      // Store by event and user
      const fileName = `${eventId}/${user.id}/${uuidv4()}.${fileExt}`;
      
      const { error: uploadError } = await supabase
        .storage
        .from('donation_screenshots') // Make sure this bucket exists
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { error: insertError } = await supabase
        .from('donations')
        .insert({
          user_id: user.id,
          amount: parseFloat(amount),
          screenshot_url: fileName,
          status: 'pending',
          event_id: eventId // <-- THE CRITICAL ADDITION
        });

      if (insertError) throw insertError;

      alert('Donation submitted successfully!');
      handleClose();
      fetchUserDonations(); // Refresh the list
    } catch (error) {
      console.error('Error submitting donation:', error.message);
      alert('Error submitting donation: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">My Donations</Typography>
        <Button variant="contained" onClick={handleClickOpen}>
          Add New Donation
        </Button>
      </Box>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              donations.map((donation) => (
                <TableRow key={donation.id}>
                  <TableCell>{new Date(donation.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>${donation.amount}</TableCell>
                  <TableCell>
                    <Chip
                      label={donation.status}
                      color={
                        donation.status === 'approved' ? 'success' :
                        donation.status === 'pending' ? 'warning' : 'error'
                      }
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* Submission Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle>Submit New Donation</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Amount"
            type="number"
            fullWidth
            variant="outlined"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Button
            component="label"
            variant="outlined"
            fullWidth
            sx={{ mt: 2 }}
          >
            Upload UPI Screenshot
            <VisuallyHiddenInput type="file" onChange={handleFileChange} accept="image/*" />
          </Button>
          {file && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Selected file: {file.name}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary" disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" disabled={submitting}>
            {submitting ? <CircularProgress size={24} /> : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}