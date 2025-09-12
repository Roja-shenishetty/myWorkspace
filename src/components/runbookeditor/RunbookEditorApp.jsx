import React, { useState, useRef, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Popover,
  TextField,
  Button,
  Tooltip,
  Container,
  ButtonGroup,
  MenuItem
} from "@mui/material";
import {
  FolderOpen as FolderOpenIcon,
  Save as SaveIcon,
  Info as InfoIcon,
  Close as CloseIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import Editor from "@monaco-editor/react";
import MarkdownEditorWithToolbar from "../shared/simple-markdown/MarkdownEditorWithToolbar";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
} from "@mui/lab";

const languages = [
  { value: "javascript", label: "JavaScript" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "jsx", label: "JSX" },
  { value: "typescript", label: "TypeScript" },
  { value: "sql", label: "SQL" },
  { value: "python", label: "Python" },
  { value: "shell", label: "Shell" },
  { value: "powershell", label: "Powershell" },
  { value: "jinja2", label: "Django" },
];

const initialSections = [
  {
    id: 1,
    title: "Create a new Project",
    description:
      "Create \n A new [react](url) app project in your local system.\n\n> Note:. <br/>  1) Need  to install [Nodejs ](url)\n  first <br/> 2) VSCode IDE for development\n\n\\`\\`\\`\nSample Code Block\n\\`\\`\\`\n<!-- Comment -->\n[Sample Link](url)\n> \n\\`Code\\` is used like this.\n<p> This is a paragraph</p>",
    code: "select * from auth.users;",
    language: "sql",
  },
];

function EditorTimeline({ sections, sectionRefs, onChange, onDelete }) {
  useEffect(() => {
    if (sectionRefs.current.length !== sections.length) {
      sectionRefs.current = sections.map(
        (_, idx) => sectionRefs.current[idx] || React.createRef()
      );
    }
  }, [sections]);

  return (
    <Timeline position="right" sx={{ padding: 0, width: "100%", mx: 0 }}>
      {sections.map((section, idx) => (
        <TimelineItem key={section.id}>
          <TimelineSeparator>
            <TimelineDot color="primary" variant="filled">
              <Typography
                ref={sectionRefs[idx]}
                variant="subtitle1"
                sx={{ color: "#fff", fontWeight: 700 }}
              >
                {idx + 1}
              </Typography>
            </TimelineDot>
            {idx < sections.length - 1 && <TimelineConnector />}
          </TimelineSeparator>
          <TimelineContent sx={{ py: 2 }}>
            <Box
              sx={{
                border: "1px solid #edeef2",
                borderRadius: 1,
                mb: 1,
                overflow: "hidden",
                background: "#fcfcfc",
              }}
            >
              <Box
                display="flex"
                alignItems="center"
                gap={2}
                sx={{ paddingLeft: 1, paddingTop: 0.5 }}
              >
                <TextField
                  label="Section Title"
                  variant="standard"
                  fullWidth
                  value={section.title}
                  onChange={(e) => onChange(section.id, "title", e.target.value)}
                />
                <IconButton
                  color="error"
                  onClick={() => onDelete(section.id)}
                  aria-label={`Delete section ${idx + 1}`}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
              <Box sx={{ padding: 1 }}>
                <Typography variant="subtitle2" mb={0.5}>
                  Description:
                </Typography>
                <MarkdownEditorWithToolbar
                  content={section.description}
                  onChange={(e) => onChange(section.id, "description", e)}
                />
              </Box>
              <Box
                display="flex"
                alignItems="center"
                gap={2}
                sx={{ paddingX: 1, marginY: 1 }}
              >
                <Typography variant="subtitle2" noWrap>
                  Language:
                </Typography>
                <TextField
                  select
                  value={section.language}
                  size="small"
                  sx={{ minWidth: 120 }}
                  onChange={(e) => onChange(section.id, "language", e.target.value)}
                >
                  {languages.map((lang) => (
                    <MenuItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
              <Box
                sx={{
                  height: 150,
                  width: "100%",
                }}
              >
                <Editor
                  height="150px"
                  width="100%"
                  language={section.language === "jinja2" ? "html" : section.language}
                  theme="vs-light"
                  value={section.code}
                  onChange={(value) => onChange(section.id, "code", value)}
                  options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    wordWrap: "on",
                  }}
                />
              </Box>
            </Box>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}

export default function RunbookEditor() {
  const [sections, setSections] = useState(initialSections);
  const [openedFiles, setOpenedFiles] = useState([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(-1);
  const [tab, setTab] = useState(0);
  const sectionRefs = useRef([]);

  // Metadata state
  const [metadata, setMetadata] = useState({
    description: "",
    tags: "",
    subject: "",
    filename: ""
  });

  const fileInputRef = useRef(null);

  // File open dialog triggered
  const handleOpenFileDialog = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  // Load JSON file and add to openedFiles, limit 6
  const handleLoadSectionsJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = JSON.parse(event.target.result);
        setOpenedFiles(prev => {
          let files = prev.filter(f => f.name !== file.name);
          if (files.length >= 6) files = files.slice(1);
          const newFiles = [...files, { name: file.name, content }];
          setCurrentFileIndex(newFiles.length - 1);

          setSections(content);
          setMetadata(md => ({
            ...md,
            filename: file.name.replace(/\.[^/.]+$/, ""),
            description: "",
            tags: "",
            subject: ""
          }));

          return newFiles;
        });
      } catch {
        alert("Invalid JSON file");
      }
    };
    reader.readAsText(file);
    e.target.value = null;
  };

  // Save sections json
  const handleSaveSectionsJSON = () => {
    if (currentFileIndex === -1) {
      alert("No file loaded to save.");
      return;
    }
    const json = JSON.stringify(sections, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const filename = openedFiles[currentFileIndex]?.name || "untitled.json";

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Save metadata json
  const handleSaveMetadata = () => {
    const { filename, ...rest } = metadata;
    const json = JSON.stringify(rest, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const metaFilename = `${filename || "untitled"}.metadata.json`;

    const link = document.createElement("a");
    link.href = url;
    link.download = metaFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Close file tab
  const handleCloseFile = (index) => {
    setOpenedFiles(prev => {
      const newFiles = prev.filter((_, i) => i !== index);
      if (newFiles.length === 0) {
        setSections([]);
        setCurrentFileIndex(-1);
      } else if (index === currentFileIndex) {
        const newIndex = index > 0 ? index - 1 : 0;
        setCurrentFileIndex(newIndex);
        setSections(newFiles[newIndex].content);
      } else if (index < currentFileIndex) {
        setCurrentFileIndex(i => i - 1);
      }
      return newFiles;
    });
  };

  // Switch active file
  const handleSwitchFile = (index) => {
    setCurrentFileIndex(index);
    setSections(openedFiles[index].content);
    const fn = openedFiles[index]?.name.replace(/\.[^/.]+$/, "");
    setMetadata(md => ({ ...md, filename: fn }));
  };

  // Change section data
  const handleChange = (id, field, value) => {
    setSections(
      sections.map((section) =>
        section.id === id ? { ...section, [field]: value } : section
      )
    );
  };

  // Delete section
  const handleDeleteSection = (id) => {
    setSections(sections.filter((section) => section.id !== id));
  };

  // Add section
  const handleAddSection = () => {
    setSections((prevSections) => {
      const newId = prevSections.length
        ? Math.max(...prevSections.map((s) => Number(s.id))) + 1
        : 1;
      return [
        ...prevSections,
        {
          id: newId,
          title: "",
          description: "",
          code: "",
          language: "javascript",
        },
      ];
    });
  };

  useEffect(() => {
    if (sectionRefs.current.length !== sections.length) {
      sectionRefs.current = sections.map(
        (_, idx) => sectionRefs.current[idx] || React.createRef()
      );
    }
  }, [sections]);

  return (
    <>
      <AppBar position="fixed" color="inherit" elevation={2} sx={{ zIndex: 1200 }}>
        <Toolbar sx={{ gap: 2, flexWrap: "wrap" }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Runbook Editor {currentFileIndex >= 0 ? `- ${openedFiles[currentFileIndex].name}` : ""}
          </Typography>
          <Tooltip title="Open JSON">
            <IconButton color="primary" onClick={handleOpenFileDialog}>
              <FolderOpenIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Save Sections">
            <IconButton color="primary" onClick={handleSaveSectionsJSON} disabled={currentFileIndex === -1}>
              <SaveIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Save Metadata">
            <IconButton color="primary" onClick={handleSaveMetadata} disabled={!metadata.filename}>
              <InfoIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Add Section">
            <IconButton color="primary" onClick={handleAddSection}>
              <AddIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <input
        type="file"
        accept="application/json"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleLoadSectionsJSON}
      />
      <Box sx={{ height: 64 }} />

      <Container maxWidth="md" sx={{ mt: 2, mb: 8 }}>
        {tab === 0 && (
          <EditorTimeline
            sections={sections}
            sectionRefs={sectionRefs}
            onChange={handleChange}
            onDelete={handleDeleteSection}
          />
        )}
        {tab === 1 && (
          <Box>
            {/* Replace this with your actual preview component */}
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Preview Mode (implement your preview here)
            </Typography>
            {/* Example raw content */}
            <pre>{JSON.stringify(sections, null, 2)}</pre>
          </Box>
        )}
      </Container>

      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: 48,
          backgroundColor: "#e0e0e0",
          display: "flex",
          alignItems: "center",
          px: 1,
          boxShadow: "0 -1px 4px rgb(0 0 0 / 0.1)",
          overflowX: "auto",
          zIndex: 1200,
        }}
      >
        {openedFiles.length === 0 && (
          <Typography variant="body2" sx={{ ml: 2, color: "#777" }}>
            No files opened
          </Typography>
        )}
        {openedFiles
          .slice(-6)
          .map((file, i) => {
            const idx = openedFiles.length - 6 + i;
            const isActive = idx === currentFileIndex;
            return (
              <Button
                key={`${file.name}-${idx}`}
                variant={isActive ? "contained" : "text"}
                color={isActive ? "primary" : "inherit"}
                size="small"
                onClick={() => handleSwitchFile(idx)}
                sx={{
                  mr: 1,
                  maxWidth: 160,
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 0.5,
                  px: 2,
                }}
              >
                <span title={file.name}>{file.name}</span>
                <IconButton
                  size="small"
                  color="inherit"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCloseFile(idx);
                  }}
                  aria-label="Close file"
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Button>
            );
          })}
      </Box>
    </>
  );
}
