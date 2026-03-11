
import React, { useState, useRef } from 'react';
import {
  Box, Typography, Paper, TextField, IconButton, Stack
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SmartUrlPreview from './SmartUrlPreview';
import QrCodeIcon from '@mui/icons-material/QrCode';
import { useEffect } from 'react';

export default function UrlDropPreviewCard({
  value,
  width,
  height,
  label = " Media Url",
  onChange,
  onDropUrl,
  showJustUrl = false,
  printMode = false }) {
  const [url, setUrl] = useState(value?.url || '');
  const [droppedUrl, setDroppedUrl] = useState(value?.url || '');
  const dropRef = useRef(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [description, setDescription] = useState(value?.description || '');

  const [widthValue, setWidthValue] = useState(value?.width || '');
  const [heightValue, setHeightValue] = useState(value?.height || '');

  useEffect(() => {
    if (onChange) {
      onChange({
        url: droppedUrl,
        description,
        width: widthValue,
        height: heightValue
      });
    }
  }, [droppedUrl, description, widthValue, heightValue]);


  useEffect(() => {
    setUrl(value?.url || '');
    setDroppedUrl(value?.url || '');
    setDescription(value?.description || '');
  }, [value]);

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const data = event.dataTransfer.getData('text/uri-list') || event.dataTransfer.getData('text/plain');
    if (data) {
      setDroppedUrl(data);
      setUrl(data);
      if (onDropUrl) onDropUrl(data);
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text');
    if (pasted.startsWith('http')) {
      setDroppedUrl(pasted);
      setUrl(pasted);
    }
  };

  const toggleShowQRCode = () => {
    setShowQRCode((prev) => !prev);
  }

  return (
    <Paper
      ref={dropRef}
      onDrop={handleDrop}
      onDragOver={(e) => { e.preventDefault(); e.stopPropagation() }}
      onPaste={handlePaste}
      sx={{
        p: 2,
        mt:1,
        border: '1px dashed #888',
        borderRadius: 2,
        backgroundColor: '#f9f9f9',
        minHeight: 18,
        width: width || 300,
        maxWidth: 800,
        mx: 'auto',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {!printMode && (
        <>
          <Typography variant="subtitle1" gutterBottom>
            {label} : (Drag & Drop or Paste a URL)
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center">
            <TextField
              fullWidth
              size="small"
              label="Enter URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setDroppedUrl(url);
                  if (onDropUrl) onDropUrl(url);
                }
              }}
            />
            {droppedUrl && (
              <>
                <IconButton onClick={() => { setDroppedUrl(''); setUrl(''); }}>
                  <DeleteIcon />
                </IconButton>
                <IconButton onClick={() => toggleShowQRCode()}>
                  <QrCodeIcon />
                </IconButton>
              </>
            )}
          </Stack>
          {!showJustUrl && (<>
            <Stack direction="row" spacing={1} alignItems="center" mt={2}>
              <TextField
                fullWidth
                size="small"
                label="Enter Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}

              />
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center" mt={2}>
              <TextField
                size="small"
                type="text"
                label="Width"
                value={widthValue}
                onChange={(e) => setWidthValue(e.target.value)}
              />
              <TextField
                size="small"
                type="text"
                label="Height"
                value={heightValue}
                onChange={(e) => setHeightValue(e.target.value)}
              />
            </Stack>
          </>
          )}
        </>
      )}

      {printMode && (
        <>
        {/* //  <Typography variant="caption" color="textPrimary" mt={1}>
        //   {droppedUrl || 'No URL Dropped'}
        // </Typography>
        //   <hr /> */}
          <Typography variant="caption" color="textPrimary">
            Description: {description}
          </Typography>
        </>
      )}

      {droppedUrl && (
        <Box
          mt={2}
          sx={{
            overflow: 'hidden',
          }}
        >
          <SmartUrlPreview
            url={droppedUrl}
            showQrCode={showQRCode}
            description={description}
            width={widthValue}
            height={heightValue}
          />
        </Box>
      )}
    </Paper>
  );
}
