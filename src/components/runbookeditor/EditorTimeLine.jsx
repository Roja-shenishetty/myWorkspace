import React, { useState, useEffect, useRef } from "react";
import {
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
} from "@mui/lab";
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    IconButton,
    MenuItem,
    Tabs,
    Tab,
    Button,
    Chip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import Editor from "@monaco-editor/react";
import MarkdownEditorWithToolbar from "../shared/simple-markdown/MarkdownEditorWithToolbar";
import UrlDropPreviewCard from "../shared/UrlDropPreviewCard/UrlDropPreviewCard";
import EventNoteIcon from "@mui/icons-material/EventNote";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import MenuBookIcon from '@mui/icons-material/MenuBook';
import TeachingPlanEditor from './TeachingPlanEditor'
import TimePopupButton from "./TimePopupButton";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PasteIcon from "@mui/icons-material/FileCopy";
import FilterNoneIcon from "@mui/icons-material/FilterNone"
import ControlPointDuplicateIcon from '@mui/icons-material/ControlPointDuplicate';
import {ArrowBackIos as ArrowBackIosIcon, ArrowForwardIos as ArrowForwardIosIcon } from '@mui/icons-material'
// Dummy languages list (replace with your real list)
const languages = [
    { value: "text", label: "Plain Text" },
    { value: "markdown", label: "Markdown" },
    { value: "javascript", label: "JavaScript" },
    { value: "jsx", label: "JSX" },
    { value: "typescript", label: "TypeScript" },
    { value: "python", label: "Python" },
    { value: "html", label: "HTML" },
    { value: "jinja2", label: "Jinja2" },
    { value: "shell", label: "shell" }
];

const languageToExtension = {
    javascript: "js",
    python: "py",
    html: "html",
    jinja2: "jinja",
    markdown: "md",
    text: "txt",
    jsx: "jsx",
    typescript: "ts",
    shell: "sh"
};

function TabPanel({ children, hidden }) {
    return <div hidden={hidden}>{!hidden && children}</div>;
}

export default function EditorTimeline({
    sections,
    onChange,
    onDelete,
    handleCloneSection,
    handlePasteSection,
    duplicateSection,
    onAddCodeFile,
    onAddMediaFile,
    onReorderCodeFile,
    onReorderMediaFile,
    selectedTabs, // New prop
    onSelectedTabChange, // New callback prop
}) {
    const [localMediaEdits, setLocalMediaEdits] = useState({});
    const [openTeachingPlanFor, setOpenTeachingPlanFor] = React.useState(null);

    const openTeachingPlan = (sectionId) => setOpenTeachingPlanFor(sectionId);
    const closeTeachingPlan = () => setOpenTeachingPlanFor(null);

    

    // Add displayMode state at the start of your component

const [displayMode, setDisplayMode] = useState("vertical"); // or load from props if you want

    const handleCodeTabChange = (sectionId, newIndex) => {
        if (onSelectedTabChange) onSelectedTabChange(sectionId, "code", newIndex);
    };

    const handleMediaTabChange = (sectionId, newIndex) => {
        if (onSelectedTabChange) onSelectedTabChange(sectionId, "media", newIndex);
    };

    const handleTeachingPlanSave = (plan) => {
        if (openTeachingPlanFor) {
            onChange(openTeachingPlanFor, "teachingPlan", null, plan);
            closeTeachingPlan();
        }
    };

    // OnMediaChange handler
    const handleLocalMediaChange = (sectionId, mediaId, field, value) => {
        setLocalMediaEdits((prev) => {
            const newState = { ...prev };
            if (!newState[sectionId]) newState[sectionId] = {};
            if (!newState[sectionId][mediaId]) newState[sectionId][mediaId] = {};

            if (field === null && typeof value === "object") {
                // Batch update
                newState[sectionId][mediaId] = {
                    ...newState[sectionId][mediaId],
                    ...value,
                };
            } else {
                // Single field update
                newState[sectionId][mediaId][field] = value;
            }
            return newState;
        });
    };

    const handleSaveMedia = (sectionId, mediaId) => {
        const updatedMedia = localMediaEdits[sectionId]?.[mediaId];
        if (updatedMedia) {
            const originalMedia = sections
                .find((s) => s.id === sectionId)
                ?.mediaFiles.find((m) => m.id === mediaId);

            if (originalMedia) {
                onChange(sectionId, "mediaFiles", mediaId, {
                    ...originalMedia,
                    ...updatedMedia,
                });

                // Clear local edits after save
                setLocalMediaEdits((prev) => {
                    const copy = { ...prev };
                    if (copy[sectionId]) {
                        delete copy[sectionId][mediaId];
                        if (Object.keys(copy[sectionId]).length === 0) delete copy[sectionId];
                    }
                    return copy;
                });
            }
        }
    };

    // Local state to keep unsaved changes per section and code file
    // Structure: { [sectionId]: { [fileId]: fileContentString } }
    const [localCodeEdits, setLocalCodeEdits] = useState({});

    // Called on typing inside Monaco Editor or TextField
    const handleLocalCodeChange = (sectionId, fileId, field, value) => {
        setLocalCodeEdits((prev) => {
            try {
                // Clone previous state or start empty
                const newState = { ...prev };

                // Ensure section object exists
                if (!newState[sectionId]) newState[sectionId] = {};

                // Ensure file object exists
                if (!newState[sectionId][fileId]) newState[sectionId][fileId] = {};

                // Update the specific field
                newState[sectionId][fileId][field] = value;

                return newState;
            } catch (e) {
                console.error("handleLocalCodeChange error:", e);
                return prev;
            }
        });
    };

    // Check if file content is changed and not saved
    const isFileUnsaved = (sectionId, fileId, originalContent) => {
        return (
            localCodeEdits[sectionId] &&
            localCodeEdits[sectionId][fileId] !== undefined &&
            localCodeEdits[sectionId][fileId]?.content !== undefined &&
            localCodeEdits[sectionId][fileId].content !== originalContent
        );
    };

    // Save button handler: update parent and clear local edits for that file
    // Called on clicking Save button per file
    const handleSave = (sectionId, fileId) => {
        const updatedFields = localCodeEdits[sectionId]?.[fileId];
        if (updatedFields) {
            // Original file including fields not edited yet
            const originalFile = sections
                .find((s) => s.id === sectionId)
                ?.codeFiles.find((f) => f.id === fileId);

            if (originalFile) {
                // Merge original with edits
                const mergedFile = { ...originalFile, ...updatedFields };

                onChange(sectionId, "codeFiles", fileId, mergedFile);

                // Clear local edits for this file
                setLocalCodeEdits((prev) => {
                    const copy = { ...prev };
                    if (copy[sectionId]) {
                        delete copy[sectionId][fileId];
                        if (Object.keys(copy[sectionId]).length === 0) {
                            delete copy[sectionId];
                        }
                    }
                    return copy;
                });
            }
        }
    };

// Add slider ref for horizontal scrolling
const sliderRef = useRef(null);
const [selectedHorizontalSection, setSelectedHorizontalSection] = useState(
  sections.length > 0 ? sections[0].id : null
);

const scrollBy = (offset) => {
  if (sliderRef.current) {
    sliderRef.current.scrollBy({ left: offset, behavior: "smooth" });
  }
};

useEffect(() => {
  if (sliderRef.current && selectedHorizontalSection) {
    const el = sliderRef.current.querySelector(`#section-${selectedHorizontalSection}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }
}, [selectedHorizontalSection, sections]);


const goToPreviousSection = () => {
  const idx = sections.findIndex((s) => s.id === selectedHorizontalSection);
  if (idx > 0) {
    setSelectedHorizontalSection(sections[idx - 1].id);
  }
};

const goToNextSection = () => {
  const idx = sections.findIndex((s) => s.id === selectedHorizontalSection);
  if (idx < sections.length - 1) {
    setSelectedHorizontalSection(sections[idx + 1].id);
  }
};

    return (
         <>
    {/* Add mode toggle UI somewhere */}
    <Tabs
      value={displayMode}
      onChange={(e, newVal) => setDisplayMode(newVal)}
      aria-label="Layout mode toggle"
      sx={{ mb: 2 }}
    >
      <Tab label="Vertical" value="vertical" />
      <Tab label="Horizontal" value="horizontal" />
    </Tabs>
     {displayMode === "vertical" && (
        <Timeline position="right" sx={{ padding: 0, width: "100%", mx: 0 }}>
            {sections.map((section, idx) => (
                <TimelineItem
                    key={section.id}
                    sx={{
                        "&::before": { display: "none" },
                    }}
                >
                    <TimelineSeparator>
                        <TimelineDot color="primary">
                            <Typography sx={{ color: "#fff", fontWeight: 700 }}>
                                {section.order}
                            </Typography>
                        </TimelineDot>
                        {idx < sections.length - 1 && <TimelineConnector />}
                    </TimelineSeparator>

                    <TimelineContent sx={{ py: 2 }}>
                        <Card variant="outlined" sx={{ width: "100%" }}>
                            <CardContent>
                                {/* Section Title */}
                                <Box display="flex" alignItems="center" gap={2} mb={2}>
                                
                                    <TextField
                                        label={ <Chip size="large" sx={{m:0, p:2, fontSize:"1.1em"}} label="Section Title"></Chip>}
                                        variant="standard"
                                        sx={{p:2}}
                                        fullWidth
                                        value={section.title}
                                        onChange={(e) =>
                                            onChange(section.id, "title", null, e.target.value)
                                        }
                                    />
                                    <TimePopupButton
                                        timeToRead={section.timeToRead}
                                        timeToRun={section.timeToRun}
                                        onChange={(field, value) => onChange(section.id, field, null, value)}
                                    />
                                    <IconButton
                                        color="primary"
                                        onClick={() => handleCloneSection(section.id)}
                                        title="Copy Section"
                                    >
                                        <ContentCopyIcon />
                                    </IconButton>
                                    <IconButton
                                        color="primary"
                                        onClick={() => handlePasteSection(section.id)}
                                        title="Paste Section"
                                    >
                                        <PasteIcon />
                                    </IconButton>
                                    <IconButton
                                        color="primary"
                                        onClick={() => duplicateSection(section.id)}
                                        title="Duplicate Section"
                                    >
                                        <ControlPointDuplicateIcon />
                                    </IconButton>


                                    <IconButton
                                        color="error"
                                        onClick={() => onDelete(section.id)}
                                        title="Delete Section"
                                    >
                                        <DeleteIcon />
                                    </IconButton>


                                    <IconButton
                                        color="primary"
                                        onClick={() => openTeachingPlan(section.id)}
                                        title="Edit Teaching Plan"
                                    >
                                        <MenuBookIcon />
                                    </IconButton>
                                </Box>

                                {/* TeachingPlanEditor modal */}
                                {openTeachingPlanFor && (
                                    <TeachingPlanEditor
                                        open={true}
                                        onClose={closeTeachingPlan}
                                        teachingPlan={sections.find(s => s.id === openTeachingPlanFor)?.teachingPlan}
                                        onSave={handleTeachingPlanSave}
                                    />
                                )}

                              

                                {/* Section Description */}
                                <Chip sx={{mb:2}} label={<Typography variant="subtitle2" >Content / Description</Typography>}/>
                                <MarkdownEditorWithToolbar
                                    content={section.description}
                                    onChange={(val) => onChange(section.id, "description", null, val)}
                                />

                                {/* =================== CODE FILES =================== */}
                                <Box mt={3} sx={{ maxWidth: "1100px" }}>
                                    <Chip label={<Typography variant="subtitle2"> Notes / Code / Resource Files :</Typography>}/>
                                    <Tabs
                                        variant="scrollable"
                                        scrollButtons="auto"
                                        allowScrollButtonsMobile
                                        value={selectedTabs.code[section.id] || 0}
                                        onChange={(e, newIndex) => handleCodeTabChange(section.id, newIndex)}
                                    >
                                        {section?.codeFiles?.map((file, fileIdx) => (
                                            <Tab
                                                key={file.id}
                                                label={
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: 1,
                                                            userSelect: "none",
                                                        }}
                                                    >
                                                        <Typography>{`${file.order}. ${file.filename
                                                            }`}</Typography>
                                                        <IconButton
                                                            size="small"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onReorderCodeFile(section.id, file.id, -1); // Move up
                                                            }}
                                                            disabled={fileIdx === 0}
                                                            title="Move Up"
                                                        >
                                                            <ArrowUpwardIcon fontSize="small" />
                                                        </IconButton>
                                                        <IconButton
                                                            size="small"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onReorderCodeFile(section.id, file.id, 1); // Move down
                                                            }}
                                                            disabled={
                                                                fileIdx === section.codeFiles.length - 1
                                                            }
                                                            title="Move Down"
                                                        >
                                                            <ArrowDownwardIcon fontSize="small" />
                                                        </IconButton>
                                                        <IconButton
                                                            size="small"
                                                            color="error"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onDelete(section.id, "codeFiles", file.id);
                                                            }}
                                                            title="Delete Code File"
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Box>
                                                }
                                            />
                                        ))}
                                        <Tab
                                            icon={<AddIcon />}
                                            onClick={() => onAddCodeFile(section.id)}
                                            aria-label="Add Code File"
                                        />
                                    </Tabs>
                                    <br />

                                    {section?.codeFiles?.map((file, fileIdx) => {
                                        const unsaved = isFileUnsaved(section.id, file.id, file.content);
                                        const content =
                                            localCodeEdits[section.id]?.[file.id]?.content ?? file.content ?? "";

                                        return (
                                            <TabPanel
                                                key={file.id}
                                                hidden={selectedTabs.code[section.id] !== fileIdx}
                                            >
                                                <Box mb={2} display="flex" gap={2}>
                                                    <TextField
                                                        label="Filename"
                                                        value={file.filename}
                                                        onChange={(e) =>
                                                            onChange(section.id, "codeFiles", file.id, {
                                                                ...file,
                                                                filename: e.target.value,
                                                            })
                                                        }
                                                    />
                                                    <TextField
                                                        select
                                                        label="Language"
                                                        value={file.language}
                                                        onChange={e => {
                                                            const newLang = e.target.value;

                                                            // Extract base name without extension
                                                            const baseName = file.filename.includes('.') ? file.filename.substring(0, file.filename.lastIndexOf('.')) : file.filename;

                                                            // New extension based on selected language
                                                            const newExt = languageToExtension[newLang] || "";

                                                            const newFilename = newExt ? `${baseName}.${newExt}` : baseName;

                                                            // Call onChange to update language and filename together
                                                            onChange(section.id, "codeFiles", file.id, {
                                                                ...file,
                                                                language: newLang,
                                                                filename: newFilename,
                                                            });
                                                        }}
                                                    >
                                                        {languages.map(lang => (
                                                            <MenuItem key={lang.value} value={lang.value}>{lang.label}</MenuItem>
                                                        ))}
                                                    </TextField>
                                                    {unsaved && (
                                                        <button
                                                            onClick={() =>
                                                                handleSave(section.id, file.id)
                                                            }
                                                            style={{
                                                                marginTop: 4,
                                                                padding: "4px 8px",
                                                                backgroundColor: "#007FFF",
                                                                color: "white",
                                                                border: "none",
                                                                borderRadius: 3,
                                                                cursor: "pointer",
                                                            }}
                                                        >
                                                            Save
                                                        </button>
                                                    )}
                                                </Box>
                                                <Editor
                                                    height="300px"
                                                    language={
                                                        file.language === "jinja2"
                                                            ? "html"
                                                            : file.language
                                                    }
                                                    value={content}
                                                    onChange={(val) =>
                                                        handleLocalCodeChange(
                                                            section.id,
                                                            file.id,
                                                            "content",
                                                            val || ""
                                                        )
                                                    }
                                                    options={{
                                                        fontSize: 14,
                                                        minimap: { enabled: false },
                                                        scrollBeyondLastLine: false,
                                                        automaticLayout: true,
                                                        wordWrap: "on",
                                                    }}
                                                />
                                            </TabPanel>
                                        );
                                    })}
                                </Box>

                                {/* =================== MEDIA FILES =================== */}
                                <Box mt={3} sx={{ maxWidth: "1100px" }}>
                                    <Chip label={<Typography variant="subtitle2">Media Files</Typography>} />
                                    <Tabs
                                        variant="scrollable"
                                        scrollButtons="auto"
                                        value={selectedTabs.media[section.id] ?? 0}
                                        onChange={(e, newIndex) => handleMediaTabChange(section.id, newIndex)}
                                    >
                                        {section?.mediaFiles?.map((file, fileIdx) => (
                                            <Tab
                                                key={file.id}
                                                label={
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: 1,
                                                            userSelect: "none",
                                                        }}
                                                    >
                                                        <Typography>{`${file.order}. Media`}</Typography>
                                                        <IconButton
                                                            size="small"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onReorderMediaFile(section.id, file.id, -1);
                                                            }}
                                                            disabled={fileIdx === 0}
                                                            title="Move Up"
                                                        >
                                                            <ArrowUpwardIcon fontSize="small" />
                                                        </IconButton>
                                                        <IconButton
                                                            size="small"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onReorderMediaFile(section.id, file.id, 1);
                                                            }}
                                                            disabled={
                                                                fileIdx === section.mediaFiles.length - 1
                                                            }
                                                            title="Move Down"
                                                        >
                                                            <ArrowDownwardIcon fontSize="small" />
                                                        </IconButton>
                                                        <IconButton
                                                            size="small"
                                                            color="error"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onDelete(section.id, "mediaFiles", file.id);
                                                            }}
                                                            title="Delete Media File"
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Box>
                                                }
                                            />
                                        ))}
                                        <Tab
                                            icon={<AddIcon />}
                                            onClick={() => onAddMediaFile(section.id)}
                                            aria-label="Add Media File"
                                        />
                                    </Tabs>
                                    <br />

                                    {section?.mediaFiles?.map((file, fileIdx) => {
                                        const currentMediaIndex = selectedTabs.media[section.id] ?? 0;
                                        const media = section.mediaFiles[currentMediaIndex];
                                        const localEdit = localMediaEdits[section.id]?.[media?.id];

                                        const url = localEdit?.url ?? media?.url;
                                        const description =
                                            localMediaEdits[section.id]?.[file.id]?.description ??
                                            file.description ??
                                            "";
                                        const mediaDescription =
                                            localMediaEdits[section.id]?.[file.id]?.mediaDescription ??
                                            file.mediaDescription ??
                                            "";
                                        const mediaWidth =
                                            localMediaEdits[section.id]?.[file.id]?.mediaWidth ??
                                            file.mediaWidth ??
                                            "";
                                        const mediaHeight =
                                            localMediaEdits[section.id]?.[file.id]?.mediaHeight ??
                                            file.mediaHeight ??
                                            "";

                                        return (
                                            <TabPanel
                                                key={file.id}
                                                hidden={selectedTabs.media[section.id] !== fileIdx}
                                                style={{
                                                    border: localMediaEdits[section.id]?.[file.id]
                                                        ? "2px solid red"
                                                        : "1px solid transparent",
                                                    padding: 8,
                                                    borderRadius: 4,
                                                }}
                                            >
                                                <Box sx={{ display: "flex" }}>
                                                    <TextField
                                                        fullWidth
                                                        label="Description"
                                                        value={description}
                                                        onChange={(e) =>
                                                            handleLocalMediaChange(
                                                                section.id,
                                                                file.id,
                                                                "description",
                                                                e.target.value
                                                            )
                                                        }
                                                        sx={{ mb: 2 }}
                                                    />
                                                    {localEdit && (
                                                        <Button
                                                            size="small"
                                                            sx={{ mb: 1, p: 0, m: 0 }}
                                                            variant="contained"
                                                            color="primary"
                                                            onClick={() => handleSaveMedia(section.id, file.id)}
                                                        >
                                                            Save
                                                        </Button>
                                                    )}
                                                </Box>
                                                <UrlDropPreviewCard
                                                    value={{
                                                        url: url,
                                                        description: mediaDescription,
                                                        width: mediaWidth,
                                                        height: mediaHeight,
                                                    }}
                                                    onChange={(newVal) => {
                                                        handleLocalMediaChange(section.id, file.id, null, {
                                                            url: newVal.url,
                                                            mediaDescription: newVal.description,
                                                            mediaWidth: newVal.width,
                                                            mediaHeight: newVal.height,
                                                        });
                                                    }}
                                                    width="100%"
                                                    height={200}
                                                />
                                            </TabPanel>
                                        );
                                    })}
                                </Box>
                            </CardContent>
                        </Card>
                    </TimelineContent>
                </TimelineItem>
            ))}
        </Timeline>
     )}

      {displayMode === "horizontal" && (
      <Box sx={{ position: "relative" }}>
        <Tabs
          value={selectedHorizontalSection}
          onChange={(e, val) => setSelectedHorizontalSection(val)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 1 }}
        >
          {sections.map(section => (
            <Tab key={section.id} label={section.title} value={section.id} />
          ))}
        </Tabs>

        <Box
          ref={sliderRef}
          sx={{
            display: "flex",
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            gap: 2,
            scrollBehavior: "smooth",
            px: 2,
          }}
        >
          {sections.map((section, idx) => (
            <Box key={section.id} sx={{  
            display: section.id === selectedHorizontalSection ? "block" : "none",
            scrollSnapAlign: "center" }}>
              {/* Your existing JSX to render a section */}
               <TimelineItem
                    key={section.id}
                    sx={{
                        "&::before": { display: "none" },
                    }}
                >
                    <TimelineSeparator>
                        <TimelineDot color="primary">
                            <Typography sx={{ color: "#fff", fontWeight: 700 }}>
                                {section.order}
                            </Typography>
                        </TimelineDot>
                        {idx < sections.length - 1 && <TimelineConnector />}
                    </TimelineSeparator>

                    <TimelineContent sx={{ py: 2 }}>
                        <Card variant="outlined" sx={{ width: "80vw" }}>
                            <CardContent>
                                {/* Section Title */}
                                <Box display="flex" alignItems="center" gap={2} mb={2}>
                                
                                    <TextField
                                        label={ <Chip size="large" sx={{m:0, p:2, fontSize:"1.1em"}} label="Section Title"></Chip>}
                                        variant="standard"
                                        sx={{p:2}}
                                        fullWidth
                                        value={section.title}
                                        onChange={(e) =>
                                            onChange(section.id, "title", null, e.target.value)
                                        }
                                    />
                                    <TimePopupButton
                                        timeToRead={section.timeToRead}
                                        timeToRun={section.timeToRun}
                                        onChange={(field, value) => onChange(section.id, field, null, value)}
                                    />
                                    <IconButton
                                        color="primary"
                                        onClick={() => handleCloneSection(section.id)}
                                        title="Copy Section"
                                    >
                                        <ContentCopyIcon />
                                    </IconButton>
                                    <IconButton
                                        color="primary"
                                        onClick={() => handlePasteSection(section.id)}
                                        title="Paste Section"
                                    >
                                        <PasteIcon />
                                    </IconButton>
                                    <IconButton
                                        color="primary"
                                        onClick={() => duplicateSection(section.id)}
                                        title="Duplicate Section"
                                    >
                                        <ControlPointDuplicateIcon />
                                    </IconButton>


                                    <IconButton
                                        color="error"
                                        onClick={() => onDelete(section.id)}
                                        title="Delete Section"
                                    >
                                        <DeleteIcon />
                                    </IconButton>


                                    <IconButton
                                        color="primary"
                                        onClick={() => openTeachingPlan(section.id)}
                                        title="Edit Teaching Plan"
                                    >
                                        <MenuBookIcon />
                                    </IconButton>
                                </Box>

                                {/* TeachingPlanEditor modal */}
                                {openTeachingPlanFor && (
                                    <TeachingPlanEditor
                                        open={true}
                                        onClose={closeTeachingPlan}
                                        teachingPlan={sections.find(s => s.id === openTeachingPlanFor)?.teachingPlan}
                                        onSave={handleTeachingPlanSave}
                                    />
                                )}

                              

                                {/* Section Description */}
                                <Chip sx={{mb:2}} label={<Typography variant="subtitle2" >Content / Description</Typography>}/>
                                <MarkdownEditorWithToolbar
                                    content={section.description}
                                    onChange={(val) => onChange(section.id, "description", null, val)}
                                />

                                {/* =================== CODE FILES =================== */}
                                <Box mt={3} sx={{ maxWidth: "1100px" }}>
                                    <Chip label={<Typography variant="subtitle2"> Notes / Code / Resource Files :</Typography>}/>
                                    <Tabs
                                        variant="scrollable"
                                        scrollButtons="auto"
                                        allowScrollButtonsMobile
                                        value={selectedTabs.code[section.id] || 0}
                                        onChange={(e, newIndex) => handleCodeTabChange(section.id, newIndex)}
                                    >
                                        {section?.codeFiles?.map((file, fileIdx) => (
                                            <Tab
                                                key={file.id}
                                                label={
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: 1,
                                                            userSelect: "none",
                                                        }}
                                                    >
                                                        <Typography>{`${file.order}. ${file.filename
                                                            }`}</Typography>
                                                        <IconButton
                                                            size="small"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onReorderCodeFile(section.id, file.id, -1); // Move up
                                                            }}
                                                            disabled={fileIdx === 0}
                                                            title="Move Up"
                                                        >
                                                            <ArrowUpwardIcon fontSize="small" />
                                                        </IconButton>
                                                        <IconButton
                                                            size="small"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onReorderCodeFile(section.id, file.id, 1); // Move down
                                                            }}
                                                            disabled={
                                                                fileIdx === section.codeFiles.length - 1
                                                            }
                                                            title="Move Down"
                                                        >
                                                            <ArrowDownwardIcon fontSize="small" />
                                                        </IconButton>
                                                        <IconButton
                                                            size="small"
                                                            color="error"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onDelete(section.id, "codeFiles", file.id);
                                                            }}
                                                            title="Delete Code File"
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Box>
                                                }
                                            />
                                        ))}
                                        <Tab
                                            icon={<AddIcon />}
                                            onClick={() => onAddCodeFile(section.id)}
                                            aria-label="Add Code File"
                                        />
                                    </Tabs>
                                    <br />

                                    {section?.codeFiles?.map((file, fileIdx) => {
                                        const unsaved = isFileUnsaved(section.id, file.id, file.content);
                                        const content =
                                            localCodeEdits[section.id]?.[file.id]?.content ?? file.content ?? "";

                                        return (
                                            <TabPanel
                                                key={file.id}
                                                hidden={selectedTabs.code[section.id] !== fileIdx}
                                            >
                                                <Box mb={2} display="flex" gap={2}>
                                                    <TextField
                                                        label="Filename"
                                                        value={file.filename}
                                                        onChange={(e) =>
                                                            onChange(section.id, "codeFiles", file.id, {
                                                                ...file,
                                                                filename: e.target.value,
                                                            })
                                                        }
                                                    />
                                                    <TextField
                                                        select
                                                        label="Language"
                                                        value={file.language}
                                                        onChange={e => {
                                                            const newLang = e.target.value;

                                                            // Extract base name without extension
                                                            const baseName = file.filename.includes('.') ? file.filename.substring(0, file.filename.lastIndexOf('.')) : file.filename;

                                                            // New extension based on selected language
                                                            const newExt = languageToExtension[newLang] || "";

                                                            const newFilename = newExt ? `${baseName}.${newExt}` : baseName;

                                                            // Call onChange to update language and filename together
                                                            onChange(section.id, "codeFiles", file.id, {
                                                                ...file,
                                                                language: newLang,
                                                                filename: newFilename,
                                                            });
                                                        }}
                                                    >
                                                        {languages.map(lang => (
                                                            <MenuItem key={lang.value} value={lang.value}>{lang.label}</MenuItem>
                                                        ))}
                                                    </TextField>
                                                    {unsaved && (
                                                        <button
                                                            onClick={() =>
                                                                handleSave(section.id, file.id)
                                                            }
                                                            style={{
                                                                marginTop: 4,
                                                                padding: "4px 8px",
                                                                backgroundColor: "#007FFF",
                                                                color: "white",
                                                                border: "none",
                                                                borderRadius: 3,
                                                                cursor: "pointer",
                                                            }}
                                                        >
                                                            Save
                                                        </button>
                                                    )}
                                                </Box>
                                                <Editor
                                                    height="300px"
                                                    language={
                                                        file.language === "jinja2"
                                                            ? "html"
                                                            : file.language
                                                    }
                                                    value={content}
                                                    onChange={(val) =>
                                                        handleLocalCodeChange(
                                                            section.id,
                                                            file.id,
                                                            "content",
                                                            val || ""
                                                        )
                                                    }
                                                    options={{
                                                        fontSize: 14,
                                                        minimap: { enabled: false },
                                                        scrollBeyondLastLine: false,
                                                        automaticLayout: true,
                                                        wordWrap: "on",
                                                    }}
                                                />
                                            </TabPanel>
                                        );
                                    })}
                                </Box>

                                {/* =================== MEDIA FILES =================== */}
                                <Box mt={3} sx={{ maxWidth: "1100px" }}>
                                    <Chip label={<Typography variant="subtitle2">Media Files</Typography>} />
                                    <Tabs
                                        variant="scrollable"
                                        scrollButtons="auto"
                                        value={selectedTabs.media[section.id] ?? 0}
                                        onChange={(e, newIndex) => handleMediaTabChange(section.id, newIndex)}
                                    >
                                        {section?.mediaFiles?.map((file, fileIdx) => (
                                            <Tab
                                                key={file.id}
                                                label={
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: 1,
                                                            userSelect: "none",
                                                        }}
                                                    >
                                                        <Typography>{`${file.order}. Media`}</Typography>
                                                        <IconButton
                                                            size="small"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onReorderMediaFile(section.id, file.id, -1);
                                                            }}
                                                            disabled={fileIdx === 0}
                                                            title="Move Up"
                                                        >
                                                            <ArrowUpwardIcon fontSize="small" />
                                                        </IconButton>
                                                        <IconButton
                                                            size="small"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onReorderMediaFile(section.id, file.id, 1);
                                                            }}
                                                            disabled={
                                                                fileIdx === section.mediaFiles.length - 1
                                                            }
                                                            title="Move Down"
                                                        >
                                                            <ArrowDownwardIcon fontSize="small" />
                                                        </IconButton>
                                                        <IconButton
                                                            size="small"
                                                            color="error"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onDelete(section.id, "mediaFiles", file.id);
                                                            }}
                                                            title="Delete Media File"
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Box>
                                                }
                                            />
                                        ))}
                                        <Tab
                                            icon={<AddIcon />}
                                            onClick={() => onAddMediaFile(section.id)}
                                            aria-label="Add Media File"
                                        />
                                    </Tabs>
                                    <br />

                                    {section?.mediaFiles?.map((file, fileIdx) => {
                                        const currentMediaIndex = selectedTabs.media[section.id] ?? 0;
                                        const media = section.mediaFiles[currentMediaIndex];
                                        const localEdit = localMediaEdits[section.id]?.[media?.id];

                                        const url = localEdit?.url ?? media?.url;
                                        const description =
                                            localMediaEdits[section.id]?.[file.id]?.description ??
                                            file.description ??
                                            "";
                                        const mediaDescription =
                                            localMediaEdits[section.id]?.[file.id]?.mediaDescription ??
                                            file.mediaDescription ??
                                            "";
                                        const mediaWidth =
                                            localMediaEdits[section.id]?.[file.id]?.mediaWidth ??
                                            file.mediaWidth ??
                                            "";
                                        const mediaHeight =
                                            localMediaEdits[section.id]?.[file.id]?.mediaHeight ??
                                            file.mediaHeight ??
                                            "";

                                        return (
                                            <TabPanel
                                                key={file.id}
                                                hidden={selectedTabs.media[section.id] !== fileIdx}
                                                style={{
                                                    border: localMediaEdits[section.id]?.[file.id]
                                                        ? "2px solid red"
                                                        : "1px solid transparent",
                                                    padding: 8,
                                                    borderRadius: 4,
                                                }}
                                            >
                                                <Box sx={{ display: "flex" }}>
                                                    <TextField
                                                        fullWidth
                                                        label="Description"
                                                        value={description}
                                                        onChange={(e) =>
                                                            handleLocalMediaChange(
                                                                section.id,
                                                                file.id,
                                                                "description",
                                                                e.target.value
                                                            )
                                                        }
                                                        sx={{ mb: 2 }}
                                                    />
                                                    {localEdit && (
                                                        <Button
                                                            size="small"
                                                            sx={{ mb: 1, p: 0, m: 0 }}
                                                            variant="contained"
                                                            color="primary"
                                                            onClick={() => handleSaveMedia(section.id, file.id)}
                                                        >
                                                            Save
                                                        </Button>
                                                    )}
                                                </Box>
                                                <UrlDropPreviewCard
                                                    value={{
                                                        url: url,
                                                        description: mediaDescription,
                                                        width: mediaWidth,
                                                        height: mediaHeight,
                                                    }}
                                                    onChange={(newVal) => {
                                                        handleLocalMediaChange(section.id, file.id, null, {
                                                            url: newVal.url,
                                                            mediaDescription: newVal.description,
                                                            mediaWidth: newVal.width,
                                                            mediaHeight: newVal.height,
                                                        });
                                                    }}
                                                    width="100%"
                                                    height={200}
                                                />
                                            </TabPanel>
                                        );
                                    })}
                                </Box>
                            </CardContent>
                        </Card>
                    </TimelineContent>
                </TimelineItem>
            </Box>
          ))}
        </Box>

        <IconButton
          onClick={goToPreviousSection}
          sx={{ position: "absolute", top: "45%", left: 0, bgcolor: "background.paper", boxShadow: 1, "&:hover": { bgcolor: "background.default" } }}
        >
          <ArrowBackIosIcon />
        </IconButton>
        <IconButton
          onClick={goToNextSection}
          sx={{ position: "absolute", top: "45%", right: 0, bgcolor: "background.paper", boxShadow: 1, "&:hover": { bgcolor: "background.default" } }}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>
    )}

   

     </>
    );
}
