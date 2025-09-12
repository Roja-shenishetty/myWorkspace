import React, { useState } from "react";
import { Container, Box, Typography, Button, TextField, CircularProgress, Alert } from "@mui/material";
import StyledPreviewTimeline from "./StyledPreviewTimeline";

export default function RunBookPreview() {
  const [sections, setSections] = useState([]);
  const [inputUrl, setInputUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = React.useRef();

  // Handle URL input loading
  const loadFromUrl = async () => {
    if (!inputUrl) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch(inputUrl);
      if (!response.ok) throw new Error("Could not fetch the file.");
      const data = await response.json();
      setSections(Array.isArray(data) ? data : data.sections || []);
    } catch (err) {
      setError("Error loading file: " + err.message);
      setSections([]);
    }
    setLoading(false);
  };

  // Handle file picker loading
  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setLoading(true);
      setError("");
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          setSections(Array.isArray(data) ? data : data.sections || []);
        } catch (err) {
          setError("Invalid JSON in file.",err);
          setSections([]);
        }
        setLoading(false);
      };
      reader.readAsText(event.target.files);
    }
  };

  return (
    <Container maxWidth="md" sx={{ pt: 4, pb: 6 }}>
      <Box mb={3}>
        <Typography variant="h5" fontWeight="bold">RunBook Preview</Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="RunBook JSON URL"
          variant="outlined"
          size="small"
          value={inputUrl}
          onChange={e => setInputUrl(e.target.value)}
          sx={{ flex: 1 }}
        />
        <Button onClick={loadFromUrl} variant="contained">Load URL</Button>
        <input
          type="file"
          accept="application/json"
          hidden
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <Button variant="outlined" onClick={() => fileInputRef.current.click()}>
          Open File
        </Button>
      </Box>
      {loading && <CircularProgress />}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {!loading && !error && sections?.length > 0 && (
        <StyledPreviewTimeline sections={sections} />
      )}
    </Container>
  );
}
