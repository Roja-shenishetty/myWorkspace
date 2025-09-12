import React, { useState, useEffect, useRef, useCallback, useMemo, createContext, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { Tree } from "react-arborist";
import {
    Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Chip, IconButton, MenuItem, Select, InputLabel, FormControl,
    Snackbar, Alert, Typography,
    Fab
} from "@mui/material";
// ... All other imports remain the same
import FolderIcon from "@mui/icons-material/Folder";
import FolderSpecialIcon from "@mui/icons-material/FolderSpecial";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DescriptionIcon from "@mui/icons-material/Description";
import LinkIcon from "@mui/icons-material/Link";
import BugReportIcon from "@mui/icons-material/BugReport";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import SchemaIcon from "@mui/icons-material/Schema";
import TimelineIcon from "@mui/icons-material/Timeline";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DownloadIcon from "@mui/icons-material/Download";
import UploadIcon from "@mui/icons-material/Upload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
// NEW: Import the new diffing libraries
import { parseDiff, Diff, Hunk } from 'react-diff-view';
import 'react-diff-view/style/index.css'; // Don't forget to import the CSS
import { createPatch } from 'jsdiff';

const TreeContext = createContext();

// All helper functions (getIconByKey, computeIcon) and the Node component remain unchanged.
// ... (omitted for brevity, they are the same as the last version)
const ICON_OPTIONS = {
    folder: <FolderIcon color="primary" fontSize="small" />,
    folderSpecial: <FolderSpecialIcon color="secondary" fontSize="small" />,
    folderOpen: <FolderOpenIcon color="success" fontSize="small" />,
    fileDefault: <InsertDriveFileIcon color="action" fontSize="small" />,
    fileDescription: <DescriptionIcon color="info" fontSize="small" />,
    url: <LinkIcon color="secondary" fontSize="small" />,
    controller: <BugReportIcon color="error" fontSize="small" />,
    model: <SchemaIcon color="info" fontSize="small" />,
    workflow: <TimelineIcon color="warning" fontSize="small" />,
    view: <ViewModuleIcon color="success" fontSize="small" />,
};

function getIconByKey(key) {
    return ICON_OPTIONS[key] || ICON_OPTIONS.fileDefault;
}

const DEFAULT_ICON_MAP = {
    folder: { default: "folder", model: "folderSpecial", workflow: "folderOpen" },
    file: { default: "fileDefault", view: "view", controller: "controller", model: "model", workflow: "workflow" },
    url: { default: "url" },
};

function computeIcon(node) {
    if (node.icon) return getIconByKey(node.icon);
    const category = node.category || "file";
    const catMap = DEFAULT_ICON_MAP[category] || {};
    const iconKey = catMap[node.type] || catMap.default || 'fileDefault';
    return getIconByKey(iconKey);
}
function Node({ node, style, dragHandle }) {
    const { openEdit, handleDelete, openAdd, previewMode, showPreviewMode } = useContext(TreeContext);
    return (
        <Box
            style={style}
            ref={dragHandle}
            sx={{
                display: "flex", alignItems: "center", gap: 1, px: 1, py: 0.5,
                bgcolor: node.isSelected ? "#e3f2fd" : "transparent",
                "&:hover": { bgcolor: "#f0f0f0" }
            }}
        >
            {computeIcon(node.data)}
            <span
                onClick={() => node.isInternal && node.toggle()}
                style={{ flexGrow: 1, cursor: "pointer" }}
                title={`Category: ${node.data.category || ""}, Type: ${node.data.type || ""}`}
            >
                {node.data.name}
                {node.data.tags?.map((tag) => (
                    <Chip key={tag} label={tag} size="small" sx={{ ml: 0.5 }} />
                ))}
            </span>
            {!previewMode && !showPreviewMode && (
                <>
                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); openEdit(node.data, node.parent?.id); }}>
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleDelete(node.data.id); }}>
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                    {node.data.category === "folder" && (
                        <>
                            <Button size="small" onClick={(e) => { e.stopPropagation(); openAdd(node.data.id, "folder"); }}>+Folder</Button>
                            <Button size="small" onClick={(e) => { e.stopPropagation(); openAdd(node.data.id, "file"); }}>+File</Button>
                            <Button size="small" onClick={(e) => { e.stopPropagation(); openAdd(node.data.id, "url"); }}>+URL</Button>
                        </>
                    )}
                </>
            )}
        </Box>
    );
}


const initialFormState = {
    name: "", category: "folder", type: "", icon: "",
    tags: [], filepath: "", url: "",
};

export default function FavouritesTree({ defaultFavouritesUrl, showPreviewMode = false,
    onNodeSelect = () => { } }) {


    const LAST_EDITED_DATA_KEY = "favourites-tree-last-edited";
    const LAST_EDITED_FILE_KEY = "favourites-tree-last-file-url";
    // NEW: A separate key to store the timestamp of the last successful fetch
    const LAST_FETCHED_TIMESTAMP_KEY = "favourites-tree-last-fetch-timestamp";


    // *** THIS IS THE FIX ***
    // Load state directly from localStorage using a function in useState.
    // This function runs only ONCE on component initialization.
    const [treeData, setTreeData] = useState(() => {
        const saved = localStorage.getItem(LAST_EDITED_DATA_KEY);
        if (saved) {
            try {
                // If data exists, parse it and set it as the initial state
                return JSON.parse(saved);
            } catch (error) {
                // If parsing fails, return an empty array
                console.error("Failed to parse tree data from localStorage", error);
                return [];
            }
        }
        // If no data exists, return an empty array
        return [];
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editNode, setEditNode] = useState(null);
    const [parentId, setParentId] = useState(null);
    const [tagInput, setTagInput] = useState("");
    const [formState, setFormState] = useState(initialFormState);
    const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });
    const [previewMode, setPreviewMode] = useState(false);

    // NEW: Create a ref for the Tree component
    const treeRef = useRef(null);

    // NEW: State for the last fetch time and the override confirmation dialog
    const [lastFetchTime, setLastFetchTime] = useState(null);
    // CHANGED: The overrideConfirm state now stores the diff patch string
    const [overrideConfirm, setOverrideConfirm] = useState({
        open: false,
        newData: null,
        diffText: null, // NEW: To hold the diff patch string
    });


    // CHANGED: This effect now handles the initial load from the default URL
    useEffect(() => {
        console.log("Default url to laod is:", defaultFavouritesUrl)
        const localData = localStorage.getItem(LAST_EDITED_DATA_KEY);
        const lastTimestamp = localStorage.getItem(LAST_FETCHED_TIMESTAMP_KEY);
        const localDataFileUrl = localStorage.getItem(LAST_EDITED_FILE_KEY) || "[]";
        let fileChanged = false;

        if (!localDataFileUrl) {
          localStorage.setItem(LAST_EDITED_FILE_KEY, defaultFavouritesUrl);
        }
        else if (defaultFavouritesUrl === localDataFileUrl) {
            console.log("File not changed...");
          
        }else{
            fileChanged = true;
        }

        if (lastTimestamp) {
            setLastFetchTime(new Date(lastTimestamp).toLocaleString());
        }

        // If a default URL is provided AND there's no local data, fetch it.
        if (defaultFavouritesUrl && (!localData || localData === '[]')) {
            console.log("No local data found, fetching from default URL...");
            setTreeData([])
            handleReloadFromDefault(false); // Call reload but don't show confirmation
            
        }
        else if(defaultFavouritesUrl && fileChanged) {
            console.log("file url changed loading new data....");
            setTreeData([])
             handleReloadFromDefault(false); // Call reload but don't show confirmation
        }
    }, [defaultFavouritesUrl]); // Only run this on mount or if the URL prop changes

    const handleReloadFromDefault = useCallback(async (confirm = true) => {
        console.log("Default url....", defaultFavouritesUrl)
        if (!defaultFavouritesUrl) return;

        try {
            const response = await fetch(defaultFavouritesUrl);
            if (!response.ok) throw new Error(`Failed to fetch file (status: ${response.status})`);
            const fetchedData = await response.json();

            console.log("Data fetched..",fetchedData)
            const localDataString = localStorage.getItem(LAST_EDITED_DATA_KEY) || "[]";
            setTreeData(fetchedData) 

            if (confirm && JSON.stringify(fetchedData) !== localDataString) {
                // CHANGED: Generate a diff patch instead of just comparing strings
                const oldFile = "local.json";
                const newFile = "remote.json";
                const oldStr = JSON.stringify(JSON.parse(localDataString), null, 2);
                const newStr = JSON.stringify(fetchedData, null, 2);

                const diffText = createPatch(oldFile, oldStr, newStr);

                setOverrideConfirm({
                    open: true,
                    newData: fetchedData, // Keep the raw new data for the override action
                    diffText: diffText,   // Store the generated diff string for the viewer
                });
            } else if (!confirm) {
                // ... (this part for initial load is unchanged)
            } else {
                setNotification({ open: true, message: "Your favourites are already up to date", severity: "info" });
            }
        } catch (error) {
            console.error("Failed to reload from default:", error);
            setNotification({ open: true, message: `Reload failed: ${error.message}`, severity: "error" });
        }
    }, [defaultFavouritesUrl]);

    const handleConfirmOverride = () => {
        setTreeData(overrideConfirm.newData);
        const newTimestamp = new Date().toISOString();
        localStorage.setItem(LAST_FETCHED_TIMESTAMP_KEY, newTimestamp);
        setLastFetchTime(new Date(newTimestamp).toLocaleString());
        setOverrideConfirm({ open: false, newData: null, diffText: null });
        setNotification({ open: true, message: "Local favourites have been updated", severity: "success" });
    };

    // A helper function to render the diff from the patch string
    const renderDiff = () => {
        if (!overrideConfirm.diffText) return null;
        const files = parseDiff(overrideConfirm.diffText);
        return files.map(({ oldRevision, newRevision, type, hunks }) => (
            <Diff key={oldRevision + '-' + newRevision} viewType="split" diffType={type} hunks={hunks}>
                {hunks => hunks.map(hunk => <Hunk key={hunk.content} hunk={hunk} />)}
            </Diff>
        ));
    };

    // This useEffect for SAVING data is now safe to use.
    useEffect(() => {
        localStorage.setItem(LAST_EDITED_DATA_KEY, JSON.stringify(treeData));
    }, [treeData]);

    // The rest of the component logic remains unchanged...
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearchTerm(searchTerm), 300);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    const addNode = useCallback((data, parentId, newNode) => {
        if (!parentId) {
            if (newNode.category === "folder" && !newNode.children) newNode.children = [];
            return [...data, newNode];
        }
        return data.map((node) => {
            if (node.id === parentId) {
                return {
                    ...node,
                    children: [
                        ...(node.children || []),
                        newNode.category === "folder" && !newNode.children ? { ...newNode, children: [] } : newNode,
                    ],
                };
            }
            if (node.children) {
                return { ...node, children: addNode(node.children, parentId, newNode) };
            }
            return node;
        });
    }, []);

    const editTreeNode = useCallback((data, id, changes) => {
        return data.map((node) => {
            if (node.id === id) {
                if (changes.category === "folder" && !changes.children)
                    changes.children = node.children || [];
                return { ...node, ...changes };
            }
            if (node.children) {
                return { ...node, children: editTreeNode(node.children, id, changes) };
            }
            return node;
        });
    }, []);

    const deleteNode = useCallback((data, id) => {
        return data
            .filter((node) => node.id !== id)
            .map((node) => (node.children ? { ...node, children: deleteNode(node.children, id) } : node));
    }, []);

    const openAdd = useCallback((pid, cat) => {
        setEditMode(false);
        setEditNode(null);
        setParentId(pid);
        setFormState({ ...initialFormState, category: cat });
        setTagInput("");
        setDialogOpen(true);
    }, []);

    const openEdit = useCallback((node, pid) => {
        setEditMode(true);
        setEditNode(node);
        setParentId(pid);
        setFormState({
            name: node.name || "", category: node.category || "file",
            type: node.type || "", icon: node.icon || "",
            tags: node.tags || [], filepath: node.filepath || "",
            url: node.url || "",
        });
        setTagInput("");
        setDialogOpen(true);
    }, []);

    const handleDelete = useCallback((id) => {
        setTreeData((prev) => deleteNode(prev, id));
        setNotification({ open: true, message: "Item deleted", severity: "info" });
    }, [deleteNode]);

    const handleSave = useCallback(() => {
        if (!formState.name.trim()) {
            setNotification({ open: true, message: "Name is required", severity: "error" });
            return;
        }
        const nodeData = {
            id: editMode ? editNode.id : uuidv4(),
            name: formState.name.trim(), category: formState.category,
            type: formState.type || undefined, icon: formState.icon || undefined,
            tags: formState.tags,
            filepath: formState.category === "file" ? formState.filepath : undefined,
            url: formState.category === "url" ? formState.url : undefined,
            children:
                formState.category === "folder" ? (editMode ? editNode.children || [] : []) : undefined,
        };
        if (editMode) {
            setTreeData((prev) => editTreeNode(prev, editNode.id, nodeData));
            setNotification({ open: true, message: "Changes saved", severity: "success" });
        } else {
            setTreeData((prev) => addNode(prev, parentId, nodeData));
            setNotification({ open: true, message: "Item added", severity: "success" });
        }
        setDialogOpen(false);
    }, [formState, editMode, editNode, parentId, addNode, editTreeNode]);

    const handleAddTag = useCallback(() => {
        const tag = tagInput.trim();
        if (tag && !formState.tags.includes(tag)) {
            setFormState(prev => ({ ...prev, tags: [...prev.tags, tag] }));
        }
        setTagInput("");
    }, [tagInput, formState.tags]);

    const handleRemoveTag = useCallback((tagToRemove) => {
        setFormState(prev => ({ ...prev, tags: prev.tags.filter((t) => t !== tagToRemove) }));
    }, []);

    const handleImportFile = useCallback((e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const importedTree = JSON.parse(event.target.result);
                if (Array.isArray(importedTree)) {
                    setTreeData(importedTree);
                    setNotification({ open: true, message: "Tree imported successfully!", severity: "success" });
                } else {
                    setNotification({ open: true, message: "Invalid format.", severity: "error" });
                }
            } catch {
                setNotification({ open: true, message: "Import failed: not valid JSON.", severity: "error" });
            }
        };
        reader.readAsText(file);
        e.target.value = null;
    }, []);

    const handleExport = useCallback(() => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(treeData, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "favourites-tree.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        setNotification({ open: true, message: "Tree exported as favourites-tree.json", severity: "info" });
    }, [treeData]);

    const matches = useCallback((node, term) => {
        if (!term) return true;
        const lowerTerm = term.toLowerCase();
        return (
            node.data.name.toLowerCase().includes(lowerTerm) ||
            (node.data.tags && node.data.tags.some((tag) => tag.toLowerCase().includes(lowerTerm)))
        );
    }, []);

    const contextValue = useMemo(() => ({
        openAdd, openEdit, handleDelete, previewMode, showPreviewMode, defaultFavouritesUrl
    }), [openAdd, openEdit, handleDelete, previewMode, showPreviewMode, defaultFavouritesUrl]);

    const typeOptionsByCategory = {
        folder: ["default", "model", "workflow"],
        file: ["default", "view", "controller", "model", "workflow"],
        url: ["default"],
    };



    // NEW: Create a stable callback handler for when a node is selected
    const handleSelect = useCallback((selectedNodes) => {
        // onSelect gives an array; since we are in single-selection mode,
        // we take the first item or null if the selection is cleared.
        if (selectedNodes.length > 0) {
            // Pass the raw data object of the selected node to the parent
            console.log(selectedNodes[0].data)
            var sn = selectedNodes[0].data;
            if (sn.category === 'url')
                onNodeSelect(selectedNodes[0].data);
        } else {
            // If nothing is selected, pass null
            onNodeSelect(null);
        }
    }, [onNodeSelect]); // This handler will update if the onNodeSelect prop changes

    // NEW: Handler to expand all folder nodes
    const handleExpandAll = useCallback(() => {
        treeRef.current?.openAll();
    }, []);

    // NEW: Handler to collapse all folder nodes
    const handleCollapseAll = useCallback(() => {
        treeRef.current?.closeAll();
    }, []);


    return (
        <TreeContext.Provider value={contextValue}>
            <Box sx={{ maxWidth: 700, mx: "auto", mt: 3, p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search by name or tag"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ mb: 2 }}
                />


                <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>


                    {!previewMode && !showPreviewMode && (
                        <>
                            <Button variant="contained" onClick={() => openAdd(null, "folder")}>Add Root Folder</Button>
                        </>
                    )
                    }
                    {!showPreviewMode && (<Button
                        variant="outlined"
                        color={previewMode ? "primary" : "secondary"}
                        startIcon={previewMode ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        onClick={() => setPreviewMode(!previewMode)}
                    >
                        {previewMode ? "Enable Edit" : "Preview "}
                    </Button>)
                    }

                    {!previewMode && !showPreviewMode && (
                        <>
                            <Fab variant="outlined" color="success"
                                onClick={handleExport}><DownloadIcon /></Fab>
                            <Fab component="label" variant="outlined" color="info">
                                <UploadIcon />
                                <input type="file" accept=".json" hidden onChange={handleImportFile} />
                            </Fab>
                        </>
                    )}


                    {/* NEW: Add the Expand and Collapse buttons */}
                    <Fab
                        variant="outlined"
                        onClick={handleExpandAll}
                    >
                        <UnfoldMoreIcon />
                    </Fab>
                    <Fab variant="outlined" onClick={handleCollapseAll}>
                        <UnfoldLessIcon />
                    </Fab>
                </Box>


                <Tree
                    // NEW: Add the ref here
                    ref={treeRef}
                    data={treeData}
                    searchTerm={debouncedSearchTerm}
                    searchMatch={matches}
                    width={700}
                    height={500}
                    rowHeight={42}
                    disableDrag={previewMode}
                    // CHANGED: Replace onChange with onMove
                    //onMove={handleMove}
                    // NEW: Add the onSelect handler and explicitly set selectionMode
                    onSelect={handleSelect}
                    onChange={setTreeData}
                >
                    {Node}
                </Tree>

                {!previewMode && (
                    <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
                        <DialogTitle>{editMode ? "Edit Favourite" : `Add ${formState.category}`}</DialogTitle>
                        <DialogContent>
                            {/* Form content remains the same */}
                            <TextField autoFocus margin="dense" label="Name" fullWidth value={formState.name} onChange={(e) => setFormState(p => ({ ...p, name: e.target.value }))} />
                            <FormControl fullWidth sx={{ mt: 2 }}>
                                <InputLabel>Category</InputLabel>
                                <Select value={formState.category} label="Category" onChange={(e) => setFormState(p => ({ ...p, category: e.target.value, type: "", icon: "" }))}>
                                    <MenuItem value="folder">Folder</MenuItem>
                                    <MenuItem value="file">File</MenuItem>
                                    <MenuItem value="url">URL</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl fullWidth sx={{ mt: 2 }}>
                                <InputLabel>Type</InputLabel>
                                <Select value={formState.type} label="Type" onChange={(e) => setFormState(p => ({ ...p, type: e.target.value }))}>
                                    <MenuItem value="">None</MenuItem>
                                    {(typeOptionsByCategory[formState.category] || []).map((opt) => (
                                        <MenuItem key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            {formState.category === "file" && <TextField margin="dense" label="Filepath" fullWidth value={formState.filepath} onChange={(e) => setFormState(p => ({ ...p, filepath: e.target.value }))} />}
                            {formState.category === "url" && <TextField margin="dense" label="URL" fullWidth value={formState.url} onChange={(e) => setFormState(p => ({ ...p, url: e.target.value }))} />}
                            <Box sx={{ mt: 2 }}>
                                <TextField label="Add Tag" size="small" value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") { e.preventDefault(); handleAddTag(); }
                                    }} />
                                <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                    {formState.tags.map((tag) => (
                                        <Chip key={tag} label={tag} onDelete={() => handleRemoveTag(tag)} />
                                    ))}
                                </Box>
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                            <Button variant="contained" onClick={handleSave}>{editMode ? "Save Changes" : "Add"}</Button>
                        </DialogActions>
                    </Dialog>
                )}

                <Box sx={{ /* ... */ }}>
                    {/* ... (All buttons, search fields, and the Tree component are unchanged) */}

                    {/* CHANGED: The confirmation dialog now uses react-diff-view */}
                    <Dialog
                        open={overrideConfirm.open}
                        onClose={() => setOverrideConfirm({ open: false, newData: null, diffText: null })}
                        fullWidth
                        maxWidth="lg"
                    >
                        <DialogTitle>Update Available - Review Changes</DialogTitle>
                        <DialogContent>
                            {/* The title and helper text are the same */}
                            <Typography sx={{ mb: 2 }}>
                                The default favourites file is different from your local version. Review the changes below before overriding.
                            </Typography>

                            {/* Render the new diff viewer */}
                            {renderDiff()}

                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOverrideConfirm({ open: false, newData: null, diffText: null })}>Cancel</Button>
                            <Button onClick={handleConfirmOverride} variant="contained" color="primary">
                                Accept and Override
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Box>

                <Snackbar
                    open={notification.open}
                    autoHideDuration={4000}
                    onClose={() => setNotification({ ...notification, open: false })}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                    <Alert onClose={() => setNotification({ ...notification, open: false })} severity={notification.severity} sx={{ width: '100%' }}>
                        {notification.message}
                    </Alert>
                </Snackbar>
            </Box>
        </TreeContext.Provider>
    );
}