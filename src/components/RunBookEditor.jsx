import React, { useState } from "react";
import {
    Container,
    Box,
    Tabs,
    Tab,
    Card,
    CardContent,
    TextField,
    IconButton,
    MenuItem,
    Fab,
    Typography,
    Grid, // Keep Grid import
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import Editor from "@monaco-editor/react";
// Timeline components
import {
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineDot,
    TimelineConnector,
    TimelineContent,
} from "@mui/lab";
import TopBar from "./topbar/TopBar";

const languages = [
    { value: "javascript", label: "JavaScript" },
    { value: "typescript", label: "TypeScript" },
    { value: "sql", label: "SQL" },
    { value: "python", label: "Python" },
];

const initialSections = [
    {
        id: 1,
        title: "Create a new Project",
        description: "Create a new Supabase project in the dashboard.",
        code: "select * from auth.users;",
        language: "sql",
    },
];

function EditorTimeline({ sections, onChange, onDelete }) {
    return (
        <Timeline position="right" sx={{ padding: 0, width: "100%", mx: 0 }}>
            {sections.map((section, idx) => (
                <TimelineItem key={section.id}>
                    <TimelineSeparator>
                        <TimelineDot color="primary" variant="filled">
                            <Typography
                                variant="subtitle1"
                                sx={{ color: "#fff", fontWeight: 700 }}
                            >
                                {idx + 1}
                            </Typography>
                        </TimelineDot>
                        {idx < sections.length - 1 && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent sx={{ py: 2 }}>
                        <Card variant="outlined" sx={{ width: "100%" }}>
                            <CardContent>
                                <Box display="flex" alignItems="center" gap={2} sx={{ mb: 1 }}>
                                    <TextField
                                        label="Section Title"
                                        variant="standard"
                                        fullWidth
                                        value={section.title}
                                        onChange={(e) =>
                                            onChange(section.id, "title", e.target.value)
                                        }
                                    />
                                    <IconButton color="error" onClick={() => onDelete(section.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                                <TextField
                                    label="Description"
                                    variant="outlined"
                                    fullWidth
                                    multiline
                                    margin="normal"
                                    value={section.description}
                                    onChange={(e) =>
                                        onChange(section.id, "description", e.target.value)
                                    }
                                />
                                <Box display="flex" alignItems="center" gap={2} sx={{ mt: 2, mb: 1 }}>
                                    <Typography variant="subtitle2">Language:</Typography>
                                    <TextField
                                        select
                                        value={section.language}
                                        size="small"
                                        sx={{ minWidth: 120 }}
                                        onChange={(e) => onChange(section.id, "language", e.target.value)}
                                    >
                                        {languages.map(lang => (
                                            <MenuItem key={lang.value} value={lang.value}>
                                                {lang.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Box>
                                <Box
                                    sx={{
                                        border: "1px solid #edeef2",
                                        borderRadius: 1,
                                        overflow: "hidden", // Good practice with Monaco
                                        mb: 1,
                                        minHeight: 150,
                                        background: "#fcfcfc",
                                    }}
                                >
                                    <Editor
                                        height="150px"
                                        language={section.language}
                                        width="60vw" // REMOVED for responsiveness
                                        theme="vs-light"
                                        value={section.code}
                                        onChange={value => onChange(section.id, "code", value)}
                                        options={{
                                            fontSize: 14,
                                            minimap: { enabled: false },
                                            scrollBeyondLastLine: false,
                                            automaticLayout: true, // ADDED for responsiveness
                                            wordWrap: "on",
                                        }}
                                    />
                                </Box>
                            </CardContent>
                        </Card>
                    </TimelineContent>
                </TimelineItem>
            ))}
        </Timeline>
    );
}

// UPDATED PreviewTimeline to be fully responsive
function PreviewTimeline({ sections }) {
    return (
        <Timeline position="right" sx={{
            padding: 0, width: "100%", '& .MuiTimelineItem-root::before': {
                flex: 'none',
                padding: 0,
            }
        }}>
            {sections.map((section, idx) => (
                <TimelineItem key={section.id} sx={{ width: "100%" }}>
                    <TimelineSeparator>
                        <TimelineDot color="primary" variant="filled" sx={{ margin: "0" }}   >
                            <Typography
                                variant="subtitle1"
                                sx={{ color: "#fff", fontWeight: 700 }}
                            >
                                {idx + 1}
                            </Typography>
                        </TimelineDot>
                        {idx < sections.length - 1 && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent sx={{ py: 2, width: "100%" }}>
                        <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
                            <Box sx={{
                                flex: "0 0 30%", // do not grow, do not shrink, fixed 30% width
                                p: 2,
                                bgcolor: "#f5f5f5",
                            }}>
                                <Typography variant="h6">{section.title}</Typography>
                                <Typography
                                    variant="body1"
                                    sx={{ mt: 0.5, mb: 1.5, whiteSpace: "pre-line" }}
                                >
                                    {section.description}
                                </Typography>
                            </Box>
                            <Box sx={{
                                flex: "0 0 50%",
                                p: 2,
                                bgcolor: "#e0f7fa",
                            }}>
                                <Box
                                    sx={{
                                        border: "1px solid #edeef2",
                                        borderRadius: 1,
                                        bgcolor: "#fcfcfc",
                                        overflow: "hidden", // Ensures editor respects border radius
                                        width: "80%",
                                        height: "100%",
                                        minHeight: "190px"

                                    }}
                                >
                                    <Editor
                                        language={section.language}
                                        width="60vw"
                                        height="200px"
                                        theme="vs-light"
                                        value={section.code}
                                        options={{
                                            fontSize: 14,
                                            minimap: { enabled: false },
                                            scrollBeyondLastLine: false,
                                            readOnly: true,
                                            wordWrap: "on",
                                            automaticLayout: true, // ADDED for responsiveness
                                        }}
                                    />
                                </Box>
                            </Box>
                        </Box>
                    </TimelineContent>
                </TimelineItem>
            ))}
        </Timeline>
    );
}

export default function TimelineEditor() {
    const [sections, setSections] = useState(initialSections);
    const [tab, setTab] = useState(0);

    const handleAddSection = () => {
        const newId = sections.length ? Math.max(...sections.map(s => s.id)) + 1 : 1;
        setSections([
            ...sections,
            {
                id: newId,
                title: "",
                description: "",
                code: "",
                language: "javascript",
            },
        ]);
    };

    const handleDeleteSection = (id) => {
        setSections(sections.filter((section) => section.id !== id));
    };

    const handleChange = (id, field, value) => {
        setSections(
            sections.map((section) =>
                section.id === id ? { ...section, [field]: value } : section
            )
        );
    };

    return (
        <div class="flex flex-col h-full w-full">  

            <div class="relative pb-8 group">
                {/* <!-- Timeline vertical line (spine) --> */}
                <div class="absolute w-px left-[11px] pt-1 h-full z-0">
                    <div class="absolute w-full h-full py-1 bg-gray-300 group-last:bg-transparent"></div>
                </div>
                {/* <!-- Timeline dot/number --> */}
                <div class="absolute left-0 flex gap-3 items-center not-prose z-10">
                    <div class="flex items-center gap-6">
                        <div class="border bg-gray-100 border-gray-400 flex items-center justify-center rounded-full w-6 h-6 text-xs text-gray-800 font-normal font-mono shadow">
                            1
                        </div>
                    </div>
                </div>
                {/* <!-- Main content grid --> */}
                <div class="grid grid-cols-1 lg:grid-cols-12 lg:gap-10 lg:ml-12">
                    {/* <!-- Left column: Title & description --> */}
                    <div class="col-span-5 ml-12 lg:ml-0">
                        <h3 class="mt-0 text-gray-800 text-base font-semibold">Create a new Supabase project</h3>
                        <p>
                            <a href="https://supabase.com/dashboard" class="underline text-blue-600">Launch a new project</a> in the Supabase Dashboard.
                        </p>
                        <p>
                            Your new database has a table for storing your users.
                            You can see that this table is currently empty by running some SQL in the
                            <a href="https://supabase.com/dashboard/project/_/sql" class="underline text-blue-600">SQL Editor</a>.
                        </p>
                    </div>
                    {/* <!-- Right column: "Editor" code block --> */}
                    <div class="col-span-7">
                        <div class="w-full space-y-2">
                            <h6 class="w-fit flex items-center text-center shadow-sm rounded border border-gray-300 bg-gray-200 px-2.5 py-1 text-xs text-gray-800">SQL_EDITOR</h6>
                            <div class="relative w-full overflow-hidden border border-gray-300 rounded-lg bg-gray-100 text-sm group">
                                <pre>
                                    <code class="flex">
                                        <div class="flex-shrink-0 select-none text-right text-gray-400 bg-gray-200 py-6 px-2">
                                            <div class="w-full">1</div>
                                        </div>
                                        <div class="p-6 overflow-x-auto flex-grow font-mono">
                                            <span class="block h-5">
                                                <span class="text-purple-700">select</span>
                                                <span class="text-gray-800"> *</span>
                                                <span class="text-purple-700"> from</span>
                                                <span class="text-blue-700"> auth</span>
                                                <span class="text-gray-800">.</span>
                                                <span class="text-blue-700">users</span>
                                                <span class="text-gray-800">;</span>
                                            </span>
                                        </div>
                                    </code>
                                </pre>
                                {/* <!-- Copy button, visible on hover --> */}
                                <button class="border rounded-md p-1 hover:bg-gray-300 transition hidden group-hover:block absolute top-2 right-2 text-gray-500" title="Copy SQL">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round">
                                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="relative pb-8 group">
                {/* <!-- Timeline vertical line (spine) --> */}
                <div class="absolute w-px left-[11px] pt-1 h-full z-0">
                    <div class="absolute w-full h-full py-1 bg-gray-300 group-last:bg-transparent"></div>
                </div>
                {/* <!-- Timeline dot/number --> */}
                <div class="absolute left-0 flex gap-3 items-center not-prose z-10">
                    <div class="flex items-center gap-6">
                        <div class="border bg-gray-100 border-gray-400 flex items-center justify-center rounded-full w-6 h-6 text-xs text-gray-800 font-normal font-mono shadow">
                            1
                        </div>
                    </div>
                </div>
                {/* <!-- Main content grid --> */}
                <div class="grid grid-cols-1 lg:grid-cols-12 lg:gap-10 lg:ml-12">
                    {/* <!-- Left column: Title & description --> */}
                    <div class="col-span-5 ml-12 lg:ml-0">
                        <h3 class="mt-0 text-gray-800 text-base font-semibold">Create a new Supabase project</h3>
                        <p>
                            <a href="https://supabase.com/dashboard" class="underline text-blue-600">Launch a new project</a> in the Supabase Dashboard.
                        </p>
                        <p>
                            Your new database has a table for storing your users.
                            You can see that this table is currently empty by running some SQL in the
                            <a href="https://supabase.com/dashboard/project/_/sql" class="underline text-blue-600">SQL Editor</a>.
                        </p>
                    </div>
                    {/* <!-- Right column: "Editor" code block --> */}
                    <div class="col-span-7">
                        <div class="w-full space-y-2">
                            <h6 class="w-fit flex items-center text-center shadow-sm rounded border border-gray-300 bg-gray-200 px-2.5 py-1 text-xs text-gray-800">SQL_EDITOR</h6>
                            <div class="relative w-full overflow-hidden border border-gray-300 rounded-lg bg-gray-100 text-sm group">
                                <pre>
                                    <code class="flex">
                                        <div class="flex-shrink-0 select-none text-right text-gray-400 bg-gray-200 py-6 px-2">
                                            <div class="w-full">1</div>
                                        </div>
                                        <div class="p-6 overflow-x-auto flex-grow font-mono">
                                            <span class="block h-5">
                                                <span class="text-purple-700">select</span>
                                                <span class="text-gray-800"> *</span>
                                                <span class="text-purple-700"> from</span>
                                                <span class="text-blue-700"> auth</span>
                                                <span class="text-gray-800">.</span>
                                                <span class="text-blue-700">users</span>
                                                <span class="text-gray-800">;</span>
                                            </span>
                                        </div>
                                    </code>
                                </pre>
                                {/* <!-- Copy button, visible on hover --> */}
                                <button class="border rounded-md p-1 hover:bg-gray-300 transition hidden group-hover:block absolute top-2 right-2 text-gray-500" title="Copy SQL">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round">
                                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="relative pb-8 "><div class=" absolute w-px left-[11px] pt-1 h-full "><div class=" absolute w-full h-full py-1 bg-border-control group-last:bg-transparent "></div></div><div class=" absolute left-0 flex gap-3 items-center not-prose "><div class="flex items-center gap-6"><div class="border bg-surface-100 border-control flex items-center justify-center rounded-full w-6 h-6 text-xs text-foreground font-normal font-mono dropshadow-sm ">2</div></div></div><div class="grid grid-cols-1 lg:grid-cols-12 lg:gap-10 lg:ml-12"><div class="col-span-5 ml-12 lg:ml-0"><h3 class="mt-0 text-foreground text-base">Create a React app</h3><p>Create a React app using the <code>create-expo-app</code> command.</p></div><div class="col-span-7 not-prose"><div class="shiki-wrapper w-full space-y-2"><h6 class="w-fit flex items-center text-center shadow-sm rounded border border-stronger bg-selection px-2.5 py-1 text-xs text-foreground">Terminal</h6><div class="shiki group relative not-prose w-full overflow-hidden border border-default rounded-lg bg-200 text-sm">    <pre>Editor</pre><button class="border rounded-md p-1 hover:bg-selection transition hidden group-hover:block absolute top-2 right-2"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy text-lighter"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg></button></div></div></div></div></div>

            <Container
                sx={{
                    maxWidth: "1000px",
                    width: "100%",
                    mx: "auto",
                    py: 4,
                    px: { xs: 2, sm: 3 }, // Add some horizontal padding
                    background: "#fff",
                    borderRadius: 2,
                    boxShadow: 2,
                    mt: 4,
                }}
            // maxWidth={false} // REMOVED to enforce the maxWidth above
            >
                <Box sx={{
                    mb: 2, display: "flex", flexDirection: "column",
                    justifyContent: "space-between", alignItems: "center"
                }}>
                    <Typography variant="h6" color="primary" fontWeight="bold">
                        Serial Document Editor
                    </Typography>
                    <Tabs value={tab} onChange={(e, v) => setTab(v)}>
                        <Tab label="Edit" />
                        <Tab label="Preview" />
                    </Tabs>
                </Box>
                {tab === 0 ? (
                    <>
                        <EditorTimeline
                            sections={sections}
                            onChange={handleChange}
                            onDelete={handleDeleteSection}
                        />
                        <Fab
                            color="primary"
                            aria-label="add"
                            onClick={handleAddSection}
                            sx={{
                                position: "fixed",
                                bottom: 32,
                                right: 32
                            }}
                        >
                            <AddIcon />
                        </Fab>
                    </>
                ) : (
                    <PreviewTimeline sections={sections} />
                )}
            </Container>

        </div>
    );
}