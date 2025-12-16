// ImageSnipManagerTable.jsx
import React, { useEffect, useState, useRef } from 'react';
import {
    Box, TextField, Autocomplete, Chip, Button, Stack, Typography, Dialog, DialogTitle, DialogContent, DialogActions,
    IconButton, MenuItem, Select, InputLabel, FormControl, Tooltip, Slider, Snackbar, Alert,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import imageCompression from 'browser-image-compression';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FileCopyIcon from '@mui/icons-material/FileCopy';

import DeleteIcon from '@mui/icons-material/Delete';
import CodeIcon from '@mui/icons-material/Code';
import Editor from '@monaco-editor/react';
import EditIcon from '@mui/icons-material/Edit'
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import LoginPage from '../pages/LoginPage';
import { useUser } from '../context/UserContext';


function detectLanguage(text) {
    const trimmed = text.trim();
    if (trimmed.startsWith('<!DOCTYPE html') || trimmed.startsWith('<html')) return 'html';
    if (trimmed.startsWith('import ') || trimmed.includes('console.log')) return 'javascript';
    if (trimmed.startsWith('def ') || trimmed.includes('print(')) return 'python';
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) return 'json';
    if (trimmed.startsWith('# ') || trimmed.includes('```')) return 'markdown';
    if (trimmed.startsWith('function') || trimmed.includes('=>')) return 'typescript';
    return 'plaintext';
}

export default function ImageSnipManagerTable({ userLoggedIn }) {
    //const [user, setUser] = useState(useUser());
    const [snips, setSnips] = useState([]);
    const [projectOptions, setProjectOptions] = useState([]);
    const [folderOptions, setFolderOptions] = useState([]);
    const [filterProject, setFilterProject] = useState(null);
    const [filterFolder, setFilterFolder] = useState(null);
    const [searchTag, setSearchTag] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [codeDialog, setCodeDialog] = useState(false);
    const [codeContent, setCodeContent] = useState('');
    const [codeLang, setCodeLang] = useState('javascript');

    const [showToast, setShowToast] = useState(false);

    const [clipboardData, setClipboardData] = useState(null);
    const [snipType, setSnipType] = useState('base64');
    const [openMetadataDialog, setOpenMetadataDialog] = useState(false);
    const [metadata, setMetadata] = useState({
        description: '',
        tags: [],
        project: null,
        folder: null,
        language: '',
        snip_path: '',
        text_content: '',
        owner: "venkat"
    });

    // Add code editing states
    const [editingCode, setEditingCode] = useState(false);
    const [editingRowId, setEditingRowId] = useState(null);

    const [createProjectOpen, setCreateProjectOpen] = useState(false);
    const [createFolderOpen, setCreateFolderOpen] = useState(false);
    const [newProjectName, setNewProjectName] = useState('');
    const [newFolderName, setNewFolderName] = useState('');
    const [newFolderProjectId, setNewFolderProjectId] = useState('');
    const [showSharedOnly, setShowSharedOnly] = useState(false);

    const [loginDialogOpen, setLoginDialogOpen] = useState(true);
    const [loginDetails, setLoginDetails] = useState({ userId: '', password: '', role: '' });

    const { user } = useUser();


    const roles = ['guest', 'editor', 'admin'];
    const canEdit = user?.role === 'editor' || user?.role === 'admin';
    const canDelete = user?.role === 'admin';
    const [filterOwner, setFilterOwner] = useState('');
    const [ownerOptions, setOwnerOptions] = useState([]);



    const handleCreateProject = async () => {
        if (newProjectName.trim()) {
            const { data } = await supabase.from('projects').insert([{ name: newProjectName }]).select();
            setProjectOptions((prev) => [...prev, ...(data || [])]);
            setFilterProject(data?.[0] || null);
            setCreateProjectOpen(false);
            setNewProjectName('');
            setFilterFolder(null)
        }
    };

    const handleCreateFolder = async () => {
        console.log("project id under which folder is getting created....", newFolderProjectId)
        if (newFolderName.trim() && newFolderProjectId) {
            const { data } = await supabase.from('folders').insert([{ name: newFolderName, project_id: newFolderProjectId }]).select();
            setFolderOptions((prev) => [...prev, ...(data || [])]);
            setFilterFolder(data?.[0] || null);
            setCreateFolderOpen(false);
            setNewFolderName('');
            setNewFolderProjectId(null);
        }
    };

    const editorRef = useRef();
    useEffect(() => {
        loadProjectsAndFolders();
        window.addEventListener('paste', handlePaste);
        return () => window.removeEventListener('paste', handlePaste);
    }, []);

    useEffect(() => {
        loadSnips();
    }, [filterFolder, searchTag, filterOwner]);

    const handleDrop = async (e) => {
        e.preventDefault();
        const items = e.dataTransfer.items;

        console.log("dropped items", items);

        for (const item of items) {
            if (item.kind === 'string' && item.type === 'text/uri-list') {
                item.getAsString((url) => {
                    setClipboardData(url);
                    setSnipType('url');
                    setMetadata((prev) => ({
                        ...prev,
                        text_content: url,
                        description: 'Dropped URL',
                    }));
                    setOpenMetadataDialog(true);
                });
                return;
            }

            if (item.kind === 'file') {
                console.log("Dropped file...", file)
                const file = item.getAsFile();
                if (file.type.startsWith('image/')) {
                    const compressed = await imageCompression(file, {
                        maxSizeMB: 1.0,
                        maxWidthOrHeight: 2048,
                        useWebWorker: true,
                    });
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        setClipboardData(reader.result);
                        setSnipType('base64');
                        setMetadata((prev) => ({
                            ...prev,
                            description: file.name,
                        }));
                        setOpenMetadataDialog(true);
                    };
                    reader.readAsDataURL(compressed);
                }
            }
        }
    };


    const handleClipboardClick = async () => {
        try {
            const clipboardItems = await navigator.clipboard.read();
            for (const item of clipboardItems) {
                if (item.types.includes('image/png')) {
                    const blob = await item.getType('image/png');
                    const compressed = await imageCompression(blob, {
                        maxSizeMB: 1.0,
                        maxWidthOrHeight: 2048,
                        useWebWorker: true
                    });
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        setClipboardData(reader.result);
                        setSnipType('base64');
                        setOpenMetadataDialog(true);
                    };
                    reader.readAsDataURL(compressed);
                    return;
                } else if (item.types.includes('text/plain')) {
                    const textBlob = await item.getType('text/plain');
                    const text = await textBlob.text();
                    const lang = detectLanguage(text);
                    setClipboardData(text);
                    setSnipType('code');
                    setMetadata((prev) => ({
                        ...prev,
                        language: lang,
                        text_content: text
                    }));
                    setOpenMetadataDialog(true);
                    return;
                }
            }
        } catch (error) {
            alert('Clipboard access denied or not supported.');
            console.error(error);
        }
    };

    const loadProjectsAndFolders = async () => {
        const { data: projects } = await supabase.from('projects').select('id, name');
        setProjectOptions([...(projects || [])]);
        setFilterProject([...(projects || [])][0]);
        await loadFoldersForProject([...(projects || [])][0].id)
    };

    const loadFoldersForProject = async (projectId) => {
        const { data: folders } = await supabase
            .from('folders')
            .select('id, name')
            .eq('project_id', projectId);

        setFolderOptions(folders || []);

        return folders || [];
    };

    const loadSnips = async () => {
        let query = supabase
            .from('image_snips')
            .select(`
            snip_no, id, image_base64, text_content, description, tags, created_at, 
            folder_id, snip_type, language, snip_path, owner, visibility,
            folders:folder_id ( id, name )
        `)
            .order('created_at', { ascending: false })
            .limit(100);

        if (showSharedOnly) {
            // Only public snippets from other users
            query = query.eq('visibility', 'public').neq('owner', user.email);
        } else {
            // Own snippets or public from others
           // query = query.or(`owner.eq.${user.email},and(visibility.eq.public,not(owner.eq.${user.email}))`);
        }
        if (!filterFolder) {
            console.log("No folders exist...");
            setSnips([])
            setFilterFolder(null)
            return;
        }

        else if (filterFolder) {
            query = query.eq('folder_id', filterFolder.id);
        }

        const { data, error } = await query;
        if (error) return console.error(error);

        const filtered = (data || []).filter((snip) =>
            (!searchTag || (snip.tags || []).some(tag => tag.toLowerCase().includes(searchTag.toLowerCase()))) &&
            (!filterOwner || snip.owner === filterOwner)
        );

        // Populate owner filter options
        const owners = Array.from(new Set((data || []).map(s => s.owner))).filter(Boolean);
        setOwnerOptions(owners);

        console.log("filtered folder...", filterFolder)
        console.log("filtered data", filtered)
        setSnips(filtered || []);
    };

    const handlePaste = async (event) => {
        const items = event.clipboardData?.items;
        if (!items) return;

        for (const item of items) {
            if (item.type.startsWith('image/')) {
                const blob = item.getAsFile();
                const compressed = await imageCompression(blob, {
                    maxSizeMB: 1.0,
                    maxWidthOrHeight: 2048,
                    useWebWorker: true,
                });
                const reader = new FileReader();
                reader.onloadend = () => {
                    setClipboardData(reader.result);
                    setSnipType('base64');
                    setOpenMetadataDialog(true);
                };
                reader.readAsDataURL(compressed);
                return;
            } else if (item.type === 'text/plain') {

                item.getAsString((text) => {
                    const lang = detectLanguage(text);
                    setClipboardData(text);
                    setSnipType(lang === 'markdown' ? 'code' : 'code'); setMetadata((prev) => ({ ...prev, text_content: text }));
                    setMetadata((prev) => ({
                        ...prev,
                        language: lang,
                        text_content: text
                    }));
                    setOpenMetadataDialog(true);
                });
                return;
            }
        }
    };

    const handleMetadataSubmit = async () => {
        const data = {
            image_base64: snipType === 'base64' ? clipboardData : null,
            text_content: snipType !== 'base64' ? metadata.text_content : null,
            description: metadata.description || '',
            tags: metadata.tags || [],
            folder_id: metadata.folder?.id || folderOptions[0]?.id || null,
            snip_type: snipType,
            language: metadata.language || '',
            snip_path: snipType === 'path' ? metadata.snip_path : null,
            visibility: metadata.visibility || 'private',
            owner: user.email,
        };

        if (editingRowId) {
            // 🔄 Update existing snip
            await supabase.from('image_snips').update(data).eq('id', editingRowId);
        } else {
            // 🆕 Create new snip
            await supabase.from('image_snips').insert([{ ...data, created_at: new Date().toISOString() }]);
        }

        // ✅ Reset form
        setOpenMetadataDialog(false);
        setEditingRowId(null);
        setMetadata({
            description: '',
            tags: [],
            project: null,
            folder: null,
            language: '',
            snip_path: '',
            text_content: '',
            visibility: 'private',
        });
        setClipboardData(null);
        setSnipType('base64');
        loadSnips();
    };



    const columns = [
        { field: 'snip_no', headerName: 'Snippet #', width: 110 },
        {
            field: 'thumbnail',
            headerName: 'Thumbnail',
            width: 150,
            sortable: false,
            renderCell: (params) => {
                const row = params.row;
                if (row.snip_type === 'base64' && row.image_base64) {
                    const rowIndex = snips.findIndex((s) => s.id === row.id);
                    return (
                        <>
                            <Box
                                component="img"
                                src={row.image_base64}
                                alt="thumb"
                                onClick={() => {
                                    setCurrentIndex(rowIndex);
                                    setOpenDialog(true);
                                }}
                                sx={{
                                    width: 60,
                                    height: 60,
                                    objectFit: 'contain',
                                    borderRadius: 1,
                                    cursor: 'pointer',
                                    transition: 'transform 0.3s',
                                    '&:hover': {
                                        transform: 'scale(6)',
                                        position: 'absolute',
                                        zIndex: 20,
                                        border: '2px solid #aaa',
                                        background: '#fff',
                                        boxShadow: 6,
                                    },
                                }}
                            />

                        </>

                    );
                } else if (row.snip_type === 'code' || row.snip_type === 'text') {
                    return (
                        <Tooltip title="Click to preview">
                            <IconButton
                                onClick={() => {
                                    setCodeContent(row.text_content);
                                    setCodeLang(row.language || 'plaintext');
                                    setCodeDialog(true);
                                    setEditingRowId(row.id);
                                }}
                            >
                                <CodeIcon />
                            </IconButton>
                        </Tooltip>
                    );
                } else if (row.snip_type == 'url') {
                    return (
                        <a href={params.row.text_content} target="_blank" rel="noopener noreferrer">
                            🔗 {params.row.text_content.length > 30 ? params.row.text_content.slice(0, 30) + '…' : params.row.text_content}
                        </a>
                    );
                }
                else {
                    return '—';
                }
            }

        },
        // Add an Actions column to DataGrid
        {
            field: 'actions',
            headerName: 'Actions',
            width: 180,
            sortable: false,
            renderCell: (params) => {
                const row = params.row;
                return (
                    <Stack direction="row" spacing={1}>
                        {canEdit && (
                            <Tooltip title="Edit Metadata">
                                <IconButton
                                    onClick={() => {
                                        setMetadata({
                                            description: row.description,
                                            tags: row.tags || [],
                                            folder: folderOptions.find(f => f.id === row.folder_id) || folderOptions[0],
                                            language: row.language || '',
                                            snip_path: row.snip_path || '',
                                            text_content: row.text_content || '',
                                            visibility: row.visibility || 'private'
                                        });
                                        setEditingRowId(row.id);
                                        setSnipType(row.snip_type || 'code');
                                        setClipboardData(row.image_base64 || row.text_content);
                                        setOpenMetadataDialog(true);
                                    }}
                                >
                                    <EditIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}
                        {canEdit && (
                            row.snip_type === 'code' || row.snip_type === 'text' ? (
                                <Tooltip title="Edit Code">
                                    <IconButton
                                        onClick={() => {
                                            setCodeContent(row.text_content);
                                            setCodeLang(row.language || 'plaintext');
                                            setEditingRowId(row.id);
                                            setEditingCode(true);
                                            setCodeDialog(true);
                                        }}
                                    >
                                        <CodeIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            ) : null

                        )}
                        <Tooltip title="Clone">
                            <IconButton
                                onClick={async () => {
                                    const clone = { ...params.row, created_at: new Date().toISOString() };
                                    delete clone.id;
                                    delete clone.snip_no;
                                    delete clone.folders;
                                    delete clone.projects;
                                    //  const response = await supabase.from('image_snips').insert([clone]);
                                    //  console.log("Cloning to ...", clone, response);
                                    setMetadata({
                                        description: row.description,
                                        tags: row.tags || [],
                                        project: projectOptions.find(p => p.id === row.project_id) || null,
                                        folder: folderOptions.find(f => f.id === row.folder_id) || null,
                                        language: row.language || '',
                                        snip_path: row.snip_path || '',
                                        text_content: row.text_content || '',
                                        visibility: row.visibility || 'private',
                                    });
                                    setClipboardData(row.image_base64 || row.text_content);
                                    setSnipType(row.snip_type || 'code');
                                    setEditingRowId(null); // Important: treat as NEW
                                    setOpenMetadataDialog(true);
                                    //loadSnips();
                                }}
                            >
                                <FileCopyIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        {canEdit && (
                            <Tooltip title="Delete">
                                <IconButton
                                    onClick={async () => {
                                        await supabase.from('image_snips').delete().eq('id', params.row.id);
                                        loadSnips();
                                    }}
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Stack >
                );
            }
        },

        {
            field: 'description',
            headerName: 'Description',
            width: 110,
            renderCell: (params) => {

                return (
                    <>                        {params.row.description}

                    </>
                )
            }
        },
        { field: 'language', headerName: 'Language', width: 130 },


        {
            field: 'folder_name',
            headerName: 'Folder Name',
            width: 150,
            renderCell: (params) => {

                return (
                    <>                        {params.row.folders.name ?? 'xx'}

                    </>
                )
            }
        },

        {
            field: 'owner',
            headerName: 'Owner',
            width: 110,
        },

        {
            field: 'download',
            headerName: 'Download',
            width: 130,
            renderCell: (params) => (
                <Button
                    size="small"
                    onClick={() => {
                        const a = document.createElement('a');
                        a.href = params.row.image_base64;
                        a.download = `snip-${params.row.id || Date.now()}.png`;
                        a.click();
                    }}
                >
                    ⬇ Download
                </Button>
            ),
        },
    ];

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null)
    }


    // Add before return in component
    if (!user) {
        return <LoginPage ></LoginPage>
    }

    // console.log(user)

    return (
        <Box sx={{ p: 2 }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
        >

            <Box
                sx={{
                    px: 2,
                    py: 1,
                    mb: 2,
                    bgcolor: '#f4f4f4',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <Stack direction='row'>
                    <Typography variant="h5" gutterBottom>🖼️  Snippets </Typography>
                </Stack>

                <Box sx={{ gap: 2, direction: 'row', display: 'flex' }}>
                    <Tooltip title="Paste from Clipboard">
                        <IconButton onClick={handleClipboardClick}>
                            <ContentPasteIcon />
                        </IconButton>
                    </Tooltip>

                    <Button size="small" variant='contained' onClick={() => setCreateProjectOpen(true)}>+ New Subject</Button>
                    <Button size="small" variant='contained' onClick={() => {
                        setNewFolderProjectId(filterProject?.id);
                        setCreateFolderOpen(true)
                    }}>+ New Folder</Button>

                </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                <Autocomplete
                    options={projectOptions}
                    getOptionLabel={(opt) => opt.name}
                    value={filterProject}
                    onChange={async (e, val) => {
                        setFilterProject(val);
                        const folders = await loadFoldersForProject(val?.id);

                        if (folders?.length > 0) {
                            setFolderOptions(folders);
                            setFilterFolder(folders[0]);
                            //setTimeout(() => {
                            //  loadSnips(); // only after folder is set
                            // }, 0);
                        } else {
                            setFolderOptions([]);
                            setFilterFolder(null);
                            setSnips([]);
                        }
                    }}
                    renderInput={(params) => <TextField {...params} label="Filter by Subject" />}
                    sx={{ minWidth: 200 }}
                />

                <Autocomplete
                    options={folderOptions}
                    getOptionLabel={(opt) => opt.name}
                    value={filterFolder}
                    onChange={(e, val) => setFilterFolder(val)}
                    renderInput={(params) => <TextField {...params} label="Filter by Folder" />}
                    sx={{ minWidth: 200 }}
                />

                <Autocomplete
                    options={ownerOptions}
                    value={filterOwner}
                    onChange={(e, val) => setFilterOwner(val || '')}
                    renderInput={(params) => <TextField {...params} label="Filter by Owner" />}
                    sx={{ minWidth: 200 }}
                />


                <TextField
                    label="Search by Tag"
                    value={searchTag}
                    onChange={(e) => setSearchTag(e.target.value)}
                    sx={{ minWidth: 200 }}
                />

                <Button onClick={() => {
                    setSearchTag('');
                    setFilterProject(projectOptions[0]);
                    setFilterFolder(folderOptions[0]);
                }}>
                    Reset
                </Button>
            </Box>

            <Box sx={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={snips.map((s) => ({ ...s, id: s.id }))}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10, 25, 50]}
                />
            </Box>

            {/* Lightbox Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="xl" fullWidth>
                {snips.length > 0 && (
                    <Box sx={{ position: 'relative', p: 2, bgcolor: '#000', textAlign: 'center' }}>
                        <img
                            src={snips[currentIndex]?.image_base64}
                            alt="Full"
                            style={{ maxWidth: '100%', maxHeight: '85vh', objectFit: 'contain' }}
                        />

                        <Box sx={{ position: 'absolute', top: '50%', left: 0, p: 2 }}>
                            <IconButton onClick={() => setCurrentIndex((currentIndex - 1 + snips.length) % snips.length)} sx={{ color: '#fff' }}>
                                <ArrowBackIosIcon />
                            </IconButton>
                        </Box>
                        <Box sx={{ position: 'absolute', top: '50%', right: 0, p: 2 }}>
                            <IconButton onClick={() => setCurrentIndex((currentIndex + 1) % snips.length)} sx={{ color: '#fff' }}>
                                <ArrowForwardIosIcon />
                            </IconButton>
                        </Box>

                        <Box sx={{ mt: 2, color: '#fff' }}>
                            <Typography variant="h6">{snips[currentIndex]?.description}</Typography>
                            <Stack direction="row" spacing={1} justifyContent="center" mt={1}>
                                {(snips[currentIndex]?.tags || []).map((tag, idx) => (
                                    <Chip key={idx} label={tag} size="small" color="primary" />
                                ))}
                            </Stack>
                            <Box mt={2}>
                                <Button variant="outlined" onClick={() => {
                                    const a = document.createElement('a');
                                    a.href = snips[currentIndex].image_base64;
                                    a.download = `snip-${snips[currentIndex].id}.png`;
                                    a.click();
                                }}>⬇ Download</Button>
                                <Button variant="text" onClick={() => setOpenDialog(false)} sx={{ ml: 2, color: '#ccc' }}>❌ Close</Button>
                            </Box>
                        </Box>
                    </Box>
                )}
            </Dialog>

            {/* Metadata Dialog */}
            <Dialog open={openMetadataDialog} onClose={() => setOpenMetadataDialog(false)}>
                <DialogTitle>📋 {editingRowId ? 'EDIT' : 'Add'} Snip Details</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Description"
                        fullWidth
                        value={metadata.description}
                        onChange={(e) => setMetadata({ ...metadata, description: e.target.value })}
                        sx={{ my: 1 }}
                    />
                    <Autocomplete
                        multiple
                        freeSolo
                        options={[]}
                        value={metadata.tags}
                        onChange={(e, value) => setMetadata({ ...metadata, tags: value })}
                        renderInput={(params) => <TextField {...params} label="Tags" />}
                        sx={{ my: 1 }}
                    />
                    <FormControl fullWidth sx={{ my: 1 }}>
                        <InputLabel>Snip Type</InputLabel>
                        <Select
                            value={snipType}
                            onChange={(e) => setSnipType(e.target.value)}
                            label="Snip Type"
                        >
                            <MenuItem value="base64">Image (Base64)</MenuItem>
                            <MenuItem value="text">Text</MenuItem>
                            <MenuItem value="url">URL</MenuItem>
                            <MenuItem value="path">File Path</MenuItem>
                            <MenuItem value="code">Code</MenuItem>
                        </Select>
                    </FormControl>
                    {(snipType === 'text' || snipType === 'code') && (
                        <TextField
                            label="Language"
                            fullWidth
                            value={metadata.language}
                            onChange={(e) => setMetadata({ ...metadata, language: e.target.value })}
                            select
                            sx={{ my: 1 }}
                        >
                            {['javascript', 'typescript', 'markdown', 'html', 'json', 'python', 'plaintext'].map((lang) => (
                                <MenuItem key={lang} value={lang}>{lang}</MenuItem>
                            ))}
                        </TextField>
                    )}
                    {snipType === 'path' && (
                        <TextField
                            label="File Path"
                            fullWidth
                            value={metadata.snip_path}
                            onChange={(e) => setMetadata({ ...metadata, snip_path: e.target.value })}
                            sx={{ my: 1 }}
                        />
                    )}

                    <Autocomplete
                        options={folderOptions.filter(f => f.id !== 'unsorted')}
                        getOptionLabel={(opt) => opt.name}
                        value={metadata.folder}
                        onChange={(e, val) => setMetadata({ ...metadata, folder: val })}
                        renderInput={(params) => <TextField {...params} label="Folder" />}
                        sx={{ my: 1 }}
                    />
                    <FormControl fullWidth sx={{ my: 1 }}>
                        <InputLabel>Visibility</InputLabel>
                        <Select
                            value={metadata.visibility || 'private'}
                            onChange={(e) => setMetadata({ ...metadata, visibility: e.target.value })}
                            label="Visibility"
                        >
                            <MenuItem value="private">Private</MenuItem>
                            <MenuItem value="public">Public</MenuItem>
                        </Select>
                    </FormControl>

                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setOpenMetadataDialog(false); setEditingRowId(null) }}>Cancel</Button>
                    <Button onClick={handleMetadataSubmit}
                        disabled={!canEdit && !editingRowId}
                        variant="contained">Save</Button>
                </DialogActions>
            </Dialog>

            {/* Code Snip Viewer */}
            <Dialog open={codeDialog} onClose={() => setCodeDialog(false)} maxWidth="lg" fullWidth>
                <DialogTitle>
                    Code Preview
                    <Tooltip title="Copy to Clipboard">
                        <IconButton onClick={() => navigator.clipboard.writeText(codeContent)}>
                            <ContentCopyIcon />
                        </IconButton>
                    </Tooltip>
                </DialogTitle>
                <DialogContent>
                    {codeLang === 'markdown' ? (
                        <Box sx={{ p: 2, background: '#f7f7f7', borderRadius: 1 }}>
                            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                                {codeContent}
                            </ReactMarkdown>
                        </Box>
                    ) : (
                        <Editor
                            height="60vh"
                            defaultLanguage={codeLang}
                            onMount={(editor) => {
                                editorRef.current = editor;
                            }}
                            value={codeContent}
                            options={{
                                fontSize: 14,
                                minimap: { enabled: false },
                                wordWrap: 'on',
                                scrollBeyondLastLine: false,
                                smoothScrolling: true,
                                automaticLayout: true,
                            }}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={async () => {
                        console.log("editing row id..", editingRowId)
                        if (editingRowId) {
                            const value = editorRef.current.getValue();
                            await supabase.from('image_snips').update({
                                text_content: value,
                                language: codeLang
                            }).eq('id', editingRowId);
                            console.log("Saved/updating ...data to server", editingRowId)
                            loadSnips();
                            // Show toast message
                            setShowToast(true);
                        }
                    }} variant="contained">Save</Button>
                    <Button onClick={() => setCodeDialog(false)}>Close</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={createProjectOpen} onClose={() => setCreateProjectOpen(false)}>
                <DialogTitle>Create Project</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        value={newProjectName}
                        onChange={(e) => setNewProjectName(e.target.value)}
                        label="Project Name"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCreateProjectOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreateProject} variant="contained">Create</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={createFolderOpen} onClose={() => setCreateFolderOpen(false)}>
                <DialogTitle>Create Folder</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        label="Folder Name"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCreateFolderOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreateFolder} variant="contained">Create</Button>
                </DialogActions>
            </Dialog>
            {/* Snackbar for Toast Message */}
            <Snackbar
                open={showToast}
                autoHideDuration={3000}
                onClose={() => setShowToast(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={() => setShowToast(false)} severity="success" sx={{ width: '100%' }}>
                    Changes saved successfully!
                </Alert>
            </Snackbar>
        </Box>
    );
}
