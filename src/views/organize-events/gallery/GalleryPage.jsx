import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Box, Typography, Paper, CircularProgress, Alert,
  Tabs, Tab, ImageList, ImageListItem, ImageListItemBar,
  IconButton, Fab, Dialog, DialogActions, DialogContent,
  DialogTitle, TextField, Button, FormControl, InputLabel, Select, MenuItem,
  Grid, List, ListItem, ListItemAvatar, Avatar, ListItemText, Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';
import { styled } from '@mui/material/styles';
import { v4 as uuidv4 } from 'uuid';

import {supabase } from '../../../libs/supabaseClient'



// --- ImageComments sub-component ---
function ImageComments({ imageId, currentUser }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('image_comments')
        .select(`*, profiles ( full_name, avatar_url )`)
        .eq('image_id', imageId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (imageId) fetchComments();
  }, [imageId]);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    try {
      setSubmitting(true);
      const { data, error } = await supabase
        .from('image_comments')
        .insert({
          image_id: imageId,
          user_id: currentUser.id,
          comment_text: newComment
        })
        .select('*, profiles ( full_name, avatar_url )')
        .single();
      if (error) throw error;
      setComments([data, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Error submitting comment:', error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
        {loading && <CircularProgress />}
        {!loading && comments.length === 0 && <Typography>No comments yet.</Typography>}
        <List>
          {comments.map((comment) => (
            <React.Fragment key={comment.id}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar><Avatar src={comment.profiles?.avatar_url} /></ListItemAvatar>
                <ListItemText
                  primary={comment.profiles?.full_name}
                  secondary={<>{comment.comment_text}<br/>{new Date(comment.created_at).toLocaleString()}</>}
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
        </List>
      </Box>
      <Box sx={{ p: 2, borderTop: '1px solid #eee' }}>
        <Grid container spacing={1} alignItems="center">
          <Grid item xs><TextField label="Write a comment..." size="small" fullWidth value={newComment} onChange={(e) => setNewComment(e.target.value)} /></Grid>
          <Grid item><Button variant="contained" onClick={handleSubmitComment} disabled={submitting}>Post</Button></Grid>
        </Grid>
      </Box>
    </Box>
  );
}

// --- VisuallyHiddenInput ---
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
  height: 1,
});

// --- Main GalleryPage Component ---
export default function GalleryPage() {
  const { eventId } = useOutletContext(); // <-- THE CRITICAL CHANGE

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState('old_memories');
  const [currentUser, setCurrentUser] = useState(null);

  const [openUpload, setOpenUpload] = useState(false);
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState('old_memories');
  const [uploading, setUploading] = useState(false);

  const [openDetail, setOpenDetail] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchImages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
      
      const { data: imageRecords, error } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('event_id', eventId) // <-- THE CRITICAL FILTER
        .eq('category', tabValue)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const updatedImages = imageRecords.map(record => {
        const { data: publicUrlData } = supabase
          .storage
          .from('gallery_photos') // Make sure this bucket is public
          .getPublicUrl(record.image_url);
        return { ...record, public_url: publicUrlData.publicUrl };
      });

      setImages(updatedImages);
    } catch (err) {
      console.error('Error fetching images:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (eventId) {
      fetchImages();
    }
  }, [eventId, tabValue]); // Re-fetch if eventId or tab changes

  const handleTabChange = (event, newValue) => setTabValue(newValue);
  const handleUploadClickOpen = () => setOpenUpload(true);
  const handleUploadClose = () => { 
    setOpenUpload(false);
    setFile(null);
    setCaption('');
  };
  const handleDetailClickOpen = (image) => {
    setSelectedImage(image);
    setOpenDetail(true);
  };
  const handleDetailClose = () => setOpenDetail(false);
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !currentUser) return;
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${eventId}/${currentUser.id}/${uuidv4()}.${fileExt}`;
      
      const { error: uploadError } = await supabase
        .storage
        .from('gallery_photos')
        .upload(fileName, file);
      if (uploadError) throw uploadError;

      const { error: insertError } = await supabase
        .from('gallery_images')
        .insert({
          uploader_user_id: currentUser.id,
          event_id: eventId, // <-- THE CRITICAL ADDITION
          image_url: fileName,
          caption: caption,
          category: category,
        });
      if (insertError) throw insertError;

      alert('Photo uploaded!');
      handleUploadClose();
      fetchImages();
    } catch (error) {
      alert('Error uploading photo: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Photo Gallery</Typography>
      <Paper><Tabs value={tabValue} onChange={handleTabChange} centered>
        <Tab label="Old Memories" value="old_memories" />
        <Tab label="Event Photos" value="event_photos" />
        <Tab label="Recent Photos" value="recent_photos" />
      </Tabs></Paper>

      {loading ? <CircularProgress /> : error ? <Alert severity="error">{error}</Alert> : (
        <ImageList sx={{ mt: 2 }} cols={3} gap={10}>
          {images.map((item) => (
            <ImageListItem key={item.id}>
              <img src={item.public_url} alt={item.caption} loading="lazy" onClick={() => handleDetailClickOpen(item)} style={{ cursor: 'pointer', borderRadius: '8px' }} />
              <ImageListItemBar
                title={item.caption}
                actionIcon={<IconButton sx={{ color: 'rgba(255, 255, 255, 0.54)' }} onClick={() => handleDetailClickOpen(item)}><InfoIcon /></IconButton>}
              />
            </ImageListItem>
          ))}
        </ImageList>
      )}

      <Fab color="primary" sx={{ position: 'fixed', bottom: 24, right: 24 }} onClick={handleUploadClickOpen}><AddIcon /></Fab>

      {/* Upload Dialog */}
      <Dialog open={openUpload} onClose={handleUploadClose}>
         <DialogTitle>Upload a Photo</DialogTitle>
         <DialogContent>
           <FormControl fullWidth margin="dense">
             <InputLabel>Category</InputLabel>
             <Select value={category} label="Category" onChange={(e) => setCategory(e.target.value)}>
               <MenuItem value="old_memories">Old Memory</MenuItem>
               <MenuItem value="event_photos">Event Photo</MenuItem>
               <MenuItem value="recent_photos">Recent Photo</MenuItem>
             </Select>
           </FormControl>
           <TextField margin="dense" label="Caption" type="text" fullWidth value={caption} onChange={(e) => setCaption(e.target.value)} />
           <Button component="label" variant="outlined" fullWidth sx={{ mt: 2 }}>
             Choose Photo
             <VisuallyHiddenInput type="file" onChange={handleFileChange} accept="image/*" />
           </Button>
           {file && <Typography>Selected: {file.name}</Typography>}
         </DialogContent>
         <DialogActions>
           <Button onClick={handleUploadClose}>Cancel</Button>
           <Button onClick={handleUpload} variant="contained" disabled={uploading}>{uploading ? <CircularProgress size={24} /> : 'Upload'}</Button>
         </DialogActions>
      </Dialog>

      {/* Detail/Comment Dialog */}
      {selectedImage && (
        <Dialog open={openDetail} onClose={handleDetailClose} fullWidth maxWidth="lg">
          <DialogTitle>{selectedImage.caption || 'View Image'}</DialogTitle>
          <DialogContent dividers sx={{ p: 0, height: '70vh' }}>
            <Grid container sx={{ height: '100%' }}>
              <Grid item xs={12} md={7} sx={{ bgcolor: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={selectedImage.public_url} alt={selectedImage.caption} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
              </Grid>
              <Grid item xs={12} md={5} sx={{ display: 'flex', flexDirection: 'column' }}>
                <ImageComments imageId={selectedImage.id} currentUser={currentUser} />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions><Button onClick={handleDetailClose}>Close</Button></DialogActions>
        </Dialog>
      )}
    </Box>
  );
}