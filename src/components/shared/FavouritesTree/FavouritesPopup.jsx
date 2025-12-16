import React, { useState } from 'react';
import {
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  TextField,
  Button,
  DialogActions
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import CloseIcon from '@mui/icons-material/Close';
import UrlDropPreviewCard from "../../shared/UrlDropPreviewCard/UrlDropPreviewCard"

// Import your existing FavouritesArborist component
import FavouritesTree from './FavouritesTree';

export default function FavouritesPopup({ defaultFavouritesUrl, showPreviewMode, onFileSelect }) {
  // State to control the visibility of the dialog
  const [open, setOpen] = useState(false);


  // State that is passed to the tree. This only updates when "Load" is clicked.
  const [urlToLoad, setUrlToLoad] = useState(defaultFavouritesUrl);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // When the "Load" button is clicked, update the urlToLoad state.
  // This will cause the FavouritesTree component to re-render with the new URL.
  const handleLoadClick = () => {
    setUrlToLoad(urlToLoad);
  };

  // This function is passed to the tree, so it can send data back up
  const handleNodeSelect = (node) => {
    if (node.url && typeof onFileSelect === 'function') {
      handleClose(); // Close the popup after selection
    }
  };



  return (
    <>
      {/* The Floating Action Button (FAB) */}
      <Fab
        color="primary"
        aria-label="favourites"
        onClick={handleClickOpen}
        sx={{
          //position: 'fixed', // Position it relative to the viewport
          //bottom: 24,         // 24px from the bottom
          //right: 24,          // 24px from the right
        }}
      >
        <StarIcon />
      </Fab>

      {/* The Dialog that acts as a popup window */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md" // Set a comfortable width for the tree
        aria-labelledby="favourites-dialog-title"
      >
        <DialogTitle id="favourites-dialog-title" sx={{ m: 0, p: 2 }}>
          My Favourites
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <TextField
              label="Favourites URL"
              variant="outlined"
              fullWidth
              size="small"
              value={urlToLoad}
              onChange={(e) => setUrlToLoad(e.target.value)}
            />
            <Button variant="contained" onClick={handleLoadClick}>
              Load
            </Button>
          </Box> */}

          <UrlDropPreviewCard
            width={"100%"}
            showJustUrl={true}
            printMode={false}
            value={{ url: urlToLoad || {} }}
            onChange={(newVal) => setUrlToLoad(newVal.url)}
          ></UrlDropPreviewCard>

          {/* Your entire FavouritesArborist component goes here */}
          <FavouritesTree
            showPreviewMode={showPreviewMode}
            defaultFavouritesUrl={urlToLoad}
            onNodeSelect={onFileSelect}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}