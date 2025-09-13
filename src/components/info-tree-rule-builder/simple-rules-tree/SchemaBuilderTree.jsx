import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Box, Button, Typography, TextField, Select, MenuItem, FormControl, InputLabel,
  List, ListItem, Collapse, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  Grid, Tooltip, Paper, AppBar, Toolbar, Chip,
  FormControlLabel, Switch, Badge, ListItemIcon, ListItemText, Drawer,
  ListSubheader, Divider, Menu, Checkbox, Stack, Card, CardContent
} from '@mui/material';
import {
  Folder as FolderIcon,
  ChevronRight as ChevronRightIcon,
  Comment as CommentIcon,
  Article as ArticleIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  AddCircle as AddCircleIcon,
  Save as SaveIcon,
  Build as BuildIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Edit as EditIcon,
  Info as InfoIcon,
  UploadFile as UploadFileIcon,
  Download as DownloadIcon,
  Warning as WarningIcon,
  Delete as DeleteIcon,
  Menu as MenuIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Favorite as FavoriteIcon,
  PlaylistAdd as PlaylistAddIcon,
  ViewList as ViewListIcon,
  TextFields as TextFieldsIcon,
  Image as ImageIcon,
  Link as LinkIcon,
  Notes as NotesIcon,
  AttachFile as AttachFileIcon,
  Add as PlusIcon,
  Description as FileTextIcon,
  InsertDriveFile as FileImageIcon,
  TextFields as TypeIcon,
  People as UsersIcon,
  Settings as SettingsIcon,
  Book as BookIcon
} from '@mui/icons-material';

// --- SHARED UTILITIES & COMPONENTS ---

const iconMap = {
  Folder: <FolderIcon />,
  ChevronRight: <ChevronRightIcon />,
  Comment: <CommentIcon />,
  Article: <ArticleIcon />,
  Default: <ArticleIcon />,
  FileText: <FileTextIcon />,
  Image: <ImageIcon/>,
  Users: <UsersIcon/>,
  Settings: <SettingsIcon/>,
  Star: <StarIcon/>,
  Heart: <FavoriteIcon/>,
  Book: <BookIcon/>
};

const buildTree = (nodes, parentId = null) =>
  nodes.filter(n => n.parentId === parentId)
    .map(n => ({ ...n, children: buildTree(nodes, n.id) }));
    
const getAncestors = (nodeId, allNodes) => {
    const ancestors = [];
    let currentNode = allNodes.find(n => n.id === nodeId);
    while (currentNode && currentNode.parentId) {
      const parent = allNodes.find(n => n.id === currentNode.parentId);
      if (parent) { ancestors.push(parent.id); currentNode = parent; } 
      else { break; }
    }
    return ancestors;
};

// --- NodeTypeEditor COMPONENT (User Provided) ---

const FIELD_TYPES = [
  { id: "text", name: "Text", icon: TypeIcon, description: "Single line text input" },
  { id: "textarea", name: "Text Area", icon: FileTextIcon, description: "Multi-line text input" },
  { id: "image", name: "Image", icon: ImageIcon, description: "Image upload field" },
  { id: "file", name: "File", icon: FileImageIcon, description: "File upload field" },
  { id: "url", name: "URL", icon: LinkIcon, description: "URL/link input" },
];

const ICONS = Object.keys(iconMap);

function NodeTypeEditor({ nodeType, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    icon: "FileText",
    description: "",
    fields: [],
  });

  const [fieldDialogOpen, setFieldDialogOpen] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [fieldForm, setFieldForm] = useState({
    name: "",
    type: "text",
    required: false,
    minCount: 0,
    maxCount: 1,
  });

  useEffect(() => {
    if (nodeType) {
      setFormData({
        ...nodeType,
        fields: nodeType.fields || [],
      });
    } else {
      setFormData({
        name: "",
        icon: "FileText",
        description: "",
        fields: [],
      });
    }
  }, [nodeType, isOpen]);

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert("Node type name is required");
      return;
    }

    const savedNodeType = {
      ...formData,
      id: nodeType?.id || `nt_${Date.now()}`,
    };

    onSave(savedNodeType);
  };

  const handleAddField = () => {
    setEditingField(null);
    setFieldForm({
      name: "",
      type: "text",
      required: false,
      minCount: 0,
      maxCount: 1,
    });
    setFieldDialogOpen(true);
  };

  const handleEditField = (field) => {
    setEditingField(field);
    setFieldForm({ ...field });
    setFieldDialogOpen(true);
  };

  const handleSaveField = () => {
    if (!fieldForm.name.trim()) {
      alert("Field name is required");
      return;
    }

    const newField = {
      ...fieldForm,
      id: editingField?.id || `field_${Date.now()}`,
    };

    setFormData((prev) => ({
      ...prev,
      fields: editingField
        ? prev.fields.map((f) => (f.id === editingField.id ? newField : f))
        : [...prev.fields, newField],
    }));

    setFieldDialogOpen(false);
  };

  const handleDeleteField = (fieldId) => {
    setFormData((prev) => ({
      ...prev,
      fields: prev.fields.filter((f) => f.id !== fieldId),
    }));
  };

  const renderFieldIcon = (typeId) => {
    const fieldType = FIELD_TYPES.find((ft) => ft.id === typeId);
    const IconCmp = fieldType?.icon || TypeIcon;
    return <IconCmp sx={{ mr: 1, color: "primary.main" }} />;
  };

  return (
    <>
      <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>{nodeType ? "Edit Node Type" : "Create Node Type"}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3}>
            <TextField
              label="Type Name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              fullWidth
              required
              autoFocus
            />

            <FormControl fullWidth>
              <InputLabel id="icon-label">Icon</InputLabel>
              <Select
                labelId="icon-label"
                value={formData.icon}
                label="Icon"
                onChange={(e) => setFormData((prev) => ({ ...prev, icon: e.target.value }))}
              >
                {ICONS.map((icon) => (
                  <MenuItem key={icon} value={icon}>
                    {icon}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              multiline
              rows={3}
              fullWidth
            />

            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="h6">Content Fields</Typography>
                <Button variant="contained" size="small" startIcon={<PlusIcon />} onClick={handleAddField}>
                  Add Field
                </Button>
              </Box>

              {formData.fields.length === 0 && (
                <Box
                  sx={{
                    textAlign: "center",
                    py: 4,
                    border: "2px dashed",
                    borderColor: "grey.400",
                    borderRadius: 2,
                    color: "text.secondary",
                  }}
                >
                  <FileTextIcon sx={{ fontSize: 40, mb: 1, opacity: 0.5, mx: "auto" }} />
                  <Typography>No content fields defined</Typography>
                  <Typography variant="body2">Click "Add Field" to create custom content fields</Typography>
                </Box>
              )}

              {formData.fields.map((field) => {
                const fieldType = FIELD_TYPES.find((ft) => ft.id === field.type);
                return (
                  <Card key={field.id} variant="outlined" sx={{ mb: 2, borderLeft: 4, borderColor: "primary.main" }}>
                    <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <Box display="flex" alignItems="center" gap={2}>
                        {renderFieldIcon(field.type)}
                        <Box>
                          <Typography variant="subtitle1" fontWeight="600">
                            {field.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Type: {fieldType?.name}
                          </Typography>
                          <Box mt={1} display="flex" gap={1}>
                            {field.required && (
                              <Chip label="Required" color="error" size="small" />
                            )}
                            {(field.type === "file" || field.type === "image") && (
                              <Chip
                                label={`${field.minCount}-${field.maxCount || "∞"}`}
                                variant="outlined"
                                size="small"
                              />
                            )}
                          </Box>
                        </Box>
                      </Box>
                      <Box>
                        <IconButton color="primary" size="small" onClick={() => handleEditField(field)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleDeleteField(field.id)}
                          sx={{ ml: 1 }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                );
              })}
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained">
            Save Node Type
          </Button>
        </DialogActions>
      </Dialog>

      {/* Field Editor Dialog */}
      <Dialog open={fieldDialogOpen} onClose={() => setFieldDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{editingField ? "Edit Field" : "Add Field"}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3}>
            <TextField
              label="Field Name"
              value={fieldForm.name}
              onChange={(e) => setFieldForm((prev) => ({ ...prev, name: e.target.value }))}
              fullWidth
              required
              autoFocus
            />

            <FormControl fullWidth>
              <InputLabel id="field-type-label">Field Type</InputLabel>
              <Select
                labelId="field-type-label"
                value={fieldForm.type}
                label="Field Type"
                onChange={(e) => setFieldForm((prev) => ({ ...prev, type: e.target.value }))}
              >
                {FIELD_TYPES.map((type) => {
                  const IconCmp = type.icon;
                  return (
                    <MenuItem key={type.id} value={type.id}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <IconCmp fontSize="small" />
                        {type.name}
                      </Box>
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Switch
                  checked={fieldForm.required}
                  onChange={(e) => setFieldForm((prev) => ({ ...prev, required: e.target.checked }))}
                />
              }
              label="Required Field"
            />

            {(fieldForm.type === "file" || fieldForm.type === "image") && (
              <Box display="flex" gap={2}>
                <TextField
                  label="Min Count"
                  type="number"
                  inputProps={{ min: 0 }}
                  value={fieldForm.minCount}
                  onChange={(e) => setFieldForm((prev) => ({ ...prev, minCount: Number(e.target.value) }))}
                  fullWidth
                />
                <TextField
                  label="Max Count"
                  type="number"
                  inputProps={{ min: 1 }}
                  value={fieldForm.maxCount}
                  onChange={(e) => setFieldForm((prev) => ({ ...prev, maxCount: Number(e.target.value) }))}
                  fullWidth
                />
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setFieldDialogOpen(false)}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSaveField}>
            Save Field
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}


// --- SCHEMA BUILDER COMPONENT ---

function SchemaBuilder({ initialSchema, onSaveSchema, onBuildInstance }) {
  const [nodes, setNodes] = useState(initialSchema.nodes);
  const [nodeTypes, setNodeTypes] = useState(initialSchema.nodeTypes);
  const [selectedNodeId, setSelectedNodeId] = useState(initialSchema.nodes[0]?.id || null);
  const [expandedNodes, setExpandedNodes] = useState([initialSchema.nodes[0]?.id]);
  const [templateName, setTemplateName] = useState(initialSchema.templateName);
  const fileInputRef = useRef(null);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [childTypeId, setChildTypeId] = useState(nodeTypes[0]?.id || '');
  const [childName, setChildName] = useState(nodeTypes[0]?.name || '');
  const [maxCount, setMaxCount] = useState('');
  const [minCount, setMinCount] = useState('0');
  
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingNode, setEditingNode] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [nodeToDelete, setNodeToDelete] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setNodes(initialSchema.nodes);
    setNodeTypes(initialSchema.nodeTypes);
    setTemplateName(initialSchema.templateName);
    const rootNodeId = initialSchema.nodes.find(n => !n.parentId)?.id || null;
    setSelectedNodeId(rootNodeId);
    setExpandedNodes(rootNodeId ? [rootNodeId] : []);
    setChildTypeId(initialSchema.nodeTypes[0]?.id || '');
    setChildName(initialSchema.nodeTypes[0]?.name || '');
  }, [initialSchema]);

  const addTypeDetailsToTree = (nodesToProcess, types) => {
    return nodesToProcess.map(node => {
      const type = types.find(t => t.id === node.typeId);
      const children = node.children ? addTypeDetailsToTree(node.children, types) : [];
      return { ...node, nodeTypeName: type?.name || 'Unknown', icon: type?.icon || 'Default', children };
    });
  };

  const tree = useMemo(() => {
    let nodesToDisplay = nodes;
    if (searchTerm.trim()) {
      const lowercasedFilter = searchTerm.trim().toLowerCase();
      const matchedNodes = nodes.filter(node =>
        node.name.toLowerCase().includes(lowercasedFilter)
      );
      
      const visibleIds = new Set();
      matchedNodes.forEach(node => {
        visibleIds.add(node.id);
        const ancestors = getAncestors(node.id, nodes);
        ancestors.forEach(id => visibleIds.add(id));
      });
      nodesToDisplay = nodes.filter(node => visibleIds.has(node.id));
    }

    const rawTree = buildTree(nodesToDisplay);
    return addTypeDetailsToTree(rawTree, nodeTypes);
  }, [nodes, nodeTypes, searchTerm]);

  useEffect(() => {
    if (searchTerm.trim()) {
      setExpandedNodes(nodes.map(n => n.id));
    }
  }, [searchTerm, nodes]);

  const handleSelect = id => setSelectedNodeId(id);
  const toggleExpand = id => setExpandedNodes(exp => exp.includes(id) ? exp.filter(x => x !== id) : [...exp, id]);
  const handleNodeNameChange = (id, newName) => setNodes(ns => ns.map(n => n.id === id ? { ...n, name: newName } : n));

  const handleAddChildClick = (parentId) => {
    setSelectedNodeId(parentId);
    if(nodeTypes.length === 0) {
      alert("Please define at least one node type in the template manager.");
      return;
    }
    const defaultType = nodeTypes[0];
    setChildTypeId(defaultType.id);
    setChildName(defaultType.name);
    setMaxCount('');
    setMinCount('0');
    setAddDialogOpen(true);
  };

  const addChildNode = () => {
    const newId = `s_node_${Date.now()}`;
    const childType = nodeTypes.find(nt => nt.id === childTypeId);
    setNodes(prev => [...prev, {
      id: newId, parentId: selectedNodeId, typeId: childType.id, name: childName,
      minCount: minCount === '' ? 0 : Number(minCount),
      maxCount: maxCount === '' || maxCount === '*' ? null : Number(maxCount),
    }]);
    setExpandedNodes(prev => (prev.includes(selectedNodeId) ? prev : [...prev, selectedNodeId]));
    setAddDialogOpen(false);
  };

  const handleEditClick = (node) => { setEditingNode({ ...node }); setEditDialogOpen(true); };
  const handleEditSave = () => {
    if (!editingNode) return;
    setNodes(currentNodes =>
      currentNodes.map(n => n.id === editingNode.id ? { ...n, name: editingNode.name, minCount: editingNode.minCount === '' ? 0 : Number(editingNode.minCount), maxCount: editingNode.maxCount === '' || editingNode.maxCount === '*' ? null : Number(editingNode.maxCount) } : n)
    );
    setEditDialogOpen(false); setEditingNode(null);
  };

  const getAllDescendantIds = (allNodes, parentId) => {
    const children = allNodes.filter(n => n.parentId === parentId);
    let allIds = children.map(c => c.id);
    children.forEach(c => { allIds = [...allIds, ...getAllDescendantIds(allNodes, c.id)]; });
    return allIds;
  };

  const handleDeleteClick = (node) => { setNodeToDelete(node); setConfirmOpen(true); };
  const handleDeleteConfirm = () => {
    if (!nodeToDelete) return;
    const descendantIds = getAllDescendantIds(nodes, nodeToDelete.id);
    const idsToDelete = [nodeToDelete.id, ...descendantIds];
    setNodes(currentNodes => currentNodes.filter(n => !idsToDelete.includes(n.id)));
    setConfirmOpen(false); setNodeToDelete(null);
  };

  const handleSave = () => {
    const finalSchema = { templateName, nodeTypes, nodes };
    onSaveSchema(finalSchema, true); alert('Schema saved!');
  };

  const handleExport = () => {
    const finalSchema = { templateName, nodeTypes, nodes };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(finalSchema, null, 2))}`;
    const link = document.createElement("a");
    link.href = jsonString; link.download = `${templateName.replace(/\s/g, '_') || 'schema'}.json`; link.click();
  };

  const handleImportClick = () => { fileInputRef.current.click(); };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedSchema = JSON.parse(e.target.result);
        if (importedSchema.templateName && importedSchema.nodeTypes && importedSchema.nodes) {
          onSaveSchema(importedSchema); alert('Schema imported successfully!');
        } else { alert('Invalid schema file format.'); }
      } catch (error) { alert('Error parsing JSON file.'); }
    };
    reader.readAsText(file); event.target.value = null;
  };
  
  function SchemaTreeNode({ node, level }) {
    const isSelected = node.id === selectedNodeId;
    return (
      <>
        <ListItem onClick={() => handleSelect(node.id)} sx={{ pl: 2 + level * 2, bgcolor: isSelected ? 'action.selected' : 'transparent', borderRadius: 1 }}>
          <IconButton size="small" onClick={(e) => { e.stopPropagation(); if (node.children.length) toggleExpand(node.id); }}>
            {node.children.length > 0 ? (expandedNodes.includes(node.id) ? <ExpandLessIcon /> : <ExpandMoreIcon />) : <Box sx={{width: 28}}/>}
          </IconButton>
          <Box sx={{ mr: 1, color: 'primary.main' }}>{iconMap[node.icon]}</Box>
          <TextField variant="standard" value={node.name} onChange={e => handleNodeNameChange(node.id, e.target.value)} onClick={e => e.stopPropagation()} sx={{ flexGrow: 1 }}/>
          <Chip label={`min: ${node.minCount ?? 0}`} size="small" sx={{ mx: 1 }} />
          <Chip label={`max: ${node.maxCount ?? '*'}`} size="small" />
          <Tooltip title="Edit Schema Rule"><IconButton size="small" onClick={(e) => { e.stopPropagation(); handleEditClick(node); }}><EditIcon /></IconButton></Tooltip>
          <Tooltip title="Add Child Schema Rule"><IconButton size="small" onClick={(e) => { e.stopPropagation(); handleAddChildClick(node.id); }}><AddCircleIcon /></IconButton></Tooltip>
          {node.parentId && (<Tooltip title="Delete Schema Rule"><IconButton size="small" onClick={(e) => { e.stopPropagation(); handleDeleteClick(node); }}><DeleteIcon color="error" /></IconButton></Tooltip>)}
        </ListItem>
        {node.children.length > 0 && (
          <Collapse in={expandedNodes.includes(node.id)} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>{node.children.map(child => <SchemaTreeNode key={child.id} node={child} level={level + 1} />)}</List>
          </Collapse>
        )}
      </>
    );
  }

  return (
    <Paper sx={{ p: 2, m: 2 }}>
      <Typography variant="h5" gutterBottom>Schema Builder</Typography>
      <TextField label="Search Nodes..." fullWidth value={searchTerm} onChange={e => setSearchTerm(e.target.value)} margin="normal" />
      <Box sx={{ border: '1px solid #ddd', borderRadius: 1, minHeight: 200, p: 1, my: 2 }}>
        <List dense>{tree.map(node => <SchemaTreeNode key={node.id} node={node} level={0} />)}</List>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, flexWrap: 'wrap' }}>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="application/json" style={{ display: 'none' }} />
        <Button variant="outlined" startIcon={<UploadFileIcon />} onClick={handleImportClick}>Import Schema</Button>
        <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleExport}>Export Schema</Button>
        <Button variant="outlined" startIcon={<SaveIcon />} onClick={handleSave}>Save Schema</Button>
        <Button variant="contained" color="primary" startIcon={<BuildIcon />} onClick={onBuildInstance}>Build Instance from Schema</Button>
      </Box>

      {/* Dialogs */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
        <DialogTitle>Add Schema Node</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Node Type</InputLabel>
            <Select value={childTypeId} label="Node Type" onChange={e => { const type = nodeTypes.find(t => t.id === e.target.value); setChildTypeId(type.id); setChildName(type.name); }}>
              {nodeTypes.map(nt => <MenuItem key={nt.id} value={nt.id}>{nt.name}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField label="Node Name (for schema)" fullWidth disabled value={childName} margin="normal" />
          <TextField label="Min Instances" type="number" fullWidth value={minCount} onChange={e => setMinCount(e.target.value)} margin="normal" />
          <TextField label="Max Instances ('*' or empty for unlimited)" fullWidth value={maxCount} onChange={e => setMaxCount(e.target.value)} margin="normal" placeholder="*" />
        </DialogContent>
        <DialogActions><Button onClick={() => setAddDialogOpen(false)}>Cancel</Button><Button onClick={addChildNode} variant="contained">Add</Button></DialogActions>
      </Dialog>
      {editingNode && (
        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
          <DialogTitle>Edit Schema Node</DialogTitle>
          <DialogContent>
            <TextField label="Node Name" fullWidth value={editingNode.name} onChange={e => setEditingNode(prev => ({...prev, name: e.target.value}))} margin="normal" />
            <TextField label="Min Instances" type="number" fullWidth value={editingNode.minCount ?? '0'} onChange={e => setEditingNode(prev => ({...prev, minCount: e.target.value}))} margin="normal" />
            <TextField label="Max Instances ('*' or empty for unlimited)" fullWidth value={editingNode.maxCount ?? ''} onChange={e => setEditingNode(prev => ({...prev, maxCount: e.target.value}))} margin="normal" placeholder="*" />
          </DialogContent>
          <DialogActions><Button onClick={() => setEditDialogOpen(false)}>Cancel</Button><Button onClick={handleEditSave} variant="contained">Save</Button></DialogActions>
        </Dialog>
      )}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent><Typography>Are you sure you want to delete the node "<strong>{nodeToDelete?.name}</strong>"? This will also delete all its children.</Typography></DialogContent>
        <DialogActions><Button onClick={() => setConfirmOpen(false)}>Cancel</Button><Button onClick={handleDeleteConfirm} variant="contained" color="error">Delete</Button></DialogActions>
      </Dialog>
    </Paper>
  );
}


// --- INSTANCE CREATOR COMPONENT ---

function InstanceCreator({ schema, onBackToSchema, favoriteNodeIds, setFavoriteNodeIds, nodes, setNodes, customLists, setCustomLists, onImportInstance }) {
  const [selectedNodeId, setSelectedNodeId] = useState(nodes[0]?.id || null);
  const [expandedNodes, setExpandedNodes] = useState([nodes[0]?.id]);
  const [showRequirements, setShowRequirements] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [possibleChildren, setPossibleChildren] = useState([]);
  const [childSchemaNodeId, setChildSchemaNodeId] = useState('');
  const [childName, setChildName] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [nodeToDelete, setNodeToDelete] = useState(null);
  const fileInputRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [isListDialogOpen, setIsListDialogOpen] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [listMenuAnchorEl, setListMenuAnchorEl] = useState(null);
  const [nodeForListMenu, setNodeForListMenu] = useState(null);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  
  useEffect(() => {
    if (nodes.length > 0) {
      const rootNode = nodes.find(n => !n.parentId);
      if (rootNode) {
        if (!selectedNodeId || !nodes.find(n => n.id === selectedNodeId)) {
            setSelectedNodeId(rootNode.id);
        }
        setExpandedNodes(prev => [...new Set([...prev, rootNode.id])]);
      }
    } else {
        setSelectedNodeId(null);
        setExpandedNodes([]);
    }
  }, [nodes, selectedNodeId]);

  const filteredNodes = useMemo(() => {
    if (!searchTerm.trim()) {
        return nodes;
    }
    const lowercasedFilter = searchTerm.trim().toLowerCase();
    const matchedNodes = nodes.filter(node =>
        node.name.toLowerCase().includes(lowercasedFilter)
    );
    
    const visibleIds = new Set();
    matchedNodes.forEach(node => {
        visibleIds.add(node.id);
        const ancestors = getAncestors(node.id, nodes);
        ancestors.forEach(id => visibleIds.add(id));
    });
    return nodes.filter(node => visibleIds.has(node.id));
  }, [nodes, searchTerm]);

  useEffect(() => {
    if (searchTerm.trim()) {
        setExpandedNodes(filteredNodes.map(n => n.id));
    }
  }, [searchTerm, filteredNodes]);

  const validationErrors = useMemo(() => {
    const errors = [];
    nodes.forEach(instanceNode => {
      const parentSchemaNode = schema.nodes.find(sn => sn.id === instanceNode.schemaNodeId);
      if (!parentSchemaNode) return;
      const childSchemaRules = schema.nodes.filter(sn => sn.parentId === parentSchemaNode.id);
      if (childSchemaRules.length === 0) return;
      const actualChildren = nodes.filter(n => n.parentId === instanceNode.id);
      childSchemaRules.forEach(rule => {
        const min = rule.minCount ?? 0;
        if (min === 0) return;
        const currentCount = actualChildren.filter(child => child.schemaNodeId === rule.id).length;
        if (currentCount < min) {
          errors.push({ id: `${instanceNode.id}-${rule.id}`, parentNodeName: instanceNode.name, requiredChildName: rule.name, minCount: min, currentCount: currentCount });
        }
      });
    });
    return errors;
  }, [nodes, schema]);
  
  const addInstanceDetailsToTree = (nodesToProcess) => {
      return nodesToProcess.map(node => {
          const schemaNode = schema.nodes.find(sn => sn.id === node.schemaNodeId);
          const type = schema.nodeTypes.find(t => t.id === schemaNode?.typeId);
          const children = node.children ? addInstanceDetailsToTree(node.children) : [];
          return { ...node, nodeTypeName: type?.name || 'Unknown', icon: type?.icon || 'Default', children };
      });
  };

  const tree = useMemo(() => buildTree(filteredNodes), [filteredNodes]);
  const detailedTree = useMemo(() => addInstanceDetailsToTree(tree), [tree, schema]);

  const handleAddChildClick = (parentId) => {
    setSelectedNodeId(parentId);
    const parentInstanceNode = nodes.find(n => n.id === parentId);
    const parentSchemaNodeId = parentInstanceNode.schemaNodeId;
    const childrenSchemaNodes = schema.nodes.filter(n => n.parentId === parentSchemaNodeId);
    setPossibleChildren(childrenSchemaNodes);
    if (childrenSchemaNodes.length > 0) {
        setChildSchemaNodeId(childrenSchemaNodes[0].id);
        setChildName(childrenSchemaNodes[0].name);
        setDialogOpen(true);
    } else {
        alert("Schema does not allow any children for this node type.");
    }
  };
  
  const addInstanceNode = () => {
      const childSchemaNode = schema.nodes.find(n => n.id === childSchemaNodeId);
      const existingChildren = nodes.filter(n => n.parentId === selectedNodeId && n.schemaNodeId === childSchemaNodeId);
      if (childSchemaNode.maxCount !== null && existingChildren.length >= childSchemaNode.maxCount) {
          alert(`Cannot add another "${childSchemaNode.name}". The maximum allowed is ${childSchemaNode.maxCount}.`);
          return;
      }
      const newId = `i_node_${Date.now()}`;
      setNodes(prev => [...prev, { id: newId, parentId: selectedNodeId, schemaNodeId: childSchemaNodeId, name: childName, content: {} }]);
      setExpandedNodes(prev => (prev.includes(selectedNodeId) ? prev : [...prev, selectedNodeId]));
      setDialogOpen(false);
  };
  
  const getAllDescendantIds = (allNodes, parentId) => {
    const children = allNodes.filter(n => n.parentId === parentId);
    let allIds = children.map(c => c.id);
    children.forEach(c => { allIds = [...allIds, ...getAllDescendantIds(allNodes, c.id)]; });
    return allIds;
  };

  const handleDeleteClick = (node) => { setNodeToDelete(node); setConfirmOpen(true); };
  const handleDeleteConfirm = () => {
    if (!nodeToDelete) return;
    const descendantIds = getAllDescendantIds(nodes, nodeToDelete.id);
    const idsToDelete = [nodeToDelete.id, ...descendantIds];
    setNodes(currentNodes => currentNodes.filter(n => !idsToDelete.includes(n.id)));
    setConfirmOpen(false); setNodeToDelete(null);
  };

  const handleSelect = id => setSelectedNodeId(id);
  const toggleExpand = id => setExpandedNodes(exp => exp.includes(id) ? exp.filter(x => x !== id) : [...exp, id]);
  const handleNodeNameChange = (id, newName) => setNodes(ns => ns.map(n => n.id === id ? { ...n, name: newName } : n));
  const handleContentChange = (nodeId, fieldId, value) => {
    setNodes(prevNodes => prevNodes.map(node => 
        node.id === nodeId ? { ...node, content: { ...node.content, [fieldId]: value } } : node
    ));
  };
  
  const handleOpenListMenu = (event, node) => {
    setListMenuAnchorEl(event.currentTarget);
    setNodeForListMenu(node);
  };

  const handleCloseListMenu = () => {
    setListMenuAnchorEl(null);
    setNodeForListMenu(null);
  };
  
  const handleToggleNodeInList = (listName) => {
    setCustomLists(prev => {
      const currentList = prev[listName] || [];
      const nodeId = nodeForListMenu.id;
      const isNodeInList = currentList.includes(nodeId);
      const newList = isNodeInList ? currentList.filter(id => id !== nodeId) : [...currentList, nodeId];
      return { ...prev, [listName]: newList };
    });
  };

  const handleCreateList = () => {
    if (newListName.trim() && !customLists[newListName.trim()]) {
      setCustomLists(prev => ({ ...prev, [newListName.trim()]: [] }));
      setNewListName('');
    }
  };

  const handleNavigateToListedNode = (nodeId) => {
    const ancestors = getAncestors(nodeId, nodes);
    setExpandedNodes(prev => [...new Set([...prev, ...ancestors, nodeId])]);
    setSelectedNodeId(nodeId);
    setIsListDialogOpen(false);
  };

  const handleExportInstance = () => {
    const exportData = {
        templateName: schema.templateName,
        instanceNodes: nodes,
        instanceFavorites: favoriteNodeIds,
        instanceLists: customLists,
        schemaUsed: schema
    };

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(exportData, null, 2))}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `${schema.templateName.replace(/\s/g, '_') || 'instance'}_instance.json`;
    link.click();
  };

  const handleImportClick = () => {
    fileInputRef.current.click();
  };
  
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        onImportInstance(importedData);
      } catch (error) {
        alert('Error parsing JSON file.');
      }
    };
    reader.readAsText(file);
    event.target.value = null;
  };
  
  const handleToggleFavorite = (nodeId) => {
    setFavoriteNodeIds(prev => prev.includes(nodeId) ? prev.filter(id => id !== nodeId) : [...prev, nodeId]);
  };

  const handleFavoriteSelect = (nodeId) => {
    const ancestors = getAncestors(nodeId, nodes);
    setExpandedNodes(prev => [...new Set([...prev, ...ancestors, nodeId])]);
    setSelectedNodeId(nodeId);
    setFavoritesOpen(false);
  };

  const selectedNodeType = useMemo(() => {
    const selectedChildSchema = possibleChildren.find(c => c.id === childSchemaNodeId);
    if (selectedChildSchema) {
        return schema.nodeTypes.find(nt => nt.id === selectedChildSchema.typeId);
    }
    return null;
  }, [possibleChildren, childSchemaNodeId, schema.nodeTypes]);


  function InstanceTreeNode({ node, level }) {
    const isSelected = node.id === selectedNodeId;
    const isExpanded = expandedNodes.includes(node.id);
    const isFavorite = favoriteNodeIds.includes(node.id);
    const schemaNode = schema.nodes.find(sn => sn.id === node.schemaNodeId);
    const possibleChildSchemas = schema.nodes.filter(sn => sn.parentId === schemaNode?.id);
    const existingChildInstances = nodes.filter(i => i.parentId === node.id);

    return (
      <>
        <ListItem onClick={() => handleSelect(node.id)} sx={{ pl: 2 + level * 2, bgcolor: isSelected ? 'action.hover' : 'transparent', borderRadius: 1 }}>
          <IconButton size="small" onClick={(e) => { e.stopPropagation(); node.children.length && toggleExpand(node.id)}}>
            {node.children.length > 0 ? (isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />) : <Box sx={{width: 28}}/>}
          </IconButton>
          <Tooltip title={`Type: ${node.nodeTypeName}`}><Box sx={{ mr: 1, color: 'secondary.main' }}>{iconMap[node.icon]}</Box></Tooltip>
          <Typography noWrap sx={{flexGrow: 1}}>{node.name}</Typography>
          <Tooltip title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}><IconButton size="small" onClick={(e) => { e.stopPropagation(); handleToggleFavorite(node.id)}}>{isFavorite ? <StarIcon color="warning" /> : <StarBorderIcon />}</IconButton></Tooltip>
          <Tooltip title="Add to List"><IconButton size="small" onClick={(e) => handleOpenListMenu(e, node)}><PlaylistAddIcon /></IconButton></Tooltip>
          <Tooltip title="Add Child Instance"><IconButton size="small" onClick={(e) => { e.stopPropagation(); handleAddChildClick(node.id)}}><AddCircleIcon color="primary"/></IconButton></Tooltip>
          {node.parentId && (<Tooltip title="Delete Instance Node"><IconButton size="small" onClick={(e) => { e.stopPropagation(); handleDeleteClick(node)}}><DeleteIcon color="error" fontSize="small"/></IconButton></Tooltip>)}
        </ListItem>
        <Collapse in={isExpanded} timeout="auto">
          {showRequirements && possibleChildSchemas.length > 0 && (
            <Box sx={{ pl: 6 + level * 2, py: 1, borderLeft: '1px solid #e0e0e0', ml: 4, my: 0.5 }}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block', fontWeight: 'bold' }}>Child Requirements:</Typography>
              {possibleChildSchemas.map(childSchema => {
                  const currentCount = existingChildInstances.filter(i => i.schemaNodeId === childSchema.id).length;
                  const min = childSchema.minCount ?? 0;
                  const max = childSchema.maxCount;
                  const minMet = currentCount >= min;
                  return (
                      <Box key={childSchema.id} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                          {minMet ? (<Tooltip title={`Minimum of ${min} met.`}><CheckCircleIcon fontSize="small" color="success" sx={{ mr: 1 }} /></Tooltip>) : (<Tooltip title={`Minimum of ${min} required. You have ${currentCount}.`}><ErrorIcon fontSize="small" color="error" sx={{ mr: 1 }} /></Tooltip>)}
                          <Typography variant="body2" sx={{ flexGrow: 1 }}>{childSchema.name}</Typography>
                          <Chip label={max !== null ? `${currentCount} / ${max}` : `${currentCount} / *`} color={max !== null && currentCount >= max ? 'error' : 'default'} size="small" />
                      </Box>
                  );
              })}
            </Box>
          )}
          <List component="div" disablePadding>{node.children.map(child => <InstanceTreeNode key={child.id} node={child} level={level + 1} />)}</List>
        </Collapse>
      </>
    );
  }

  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)'}}>
        <Paper sx={{ p: 2, m: 2, width: '50%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, flexShrink: 0 }}>
            <Box>
            <Typography variant="h5">Instance Creator</Typography>
            <Typography variant="subtitle1" color="text.secondary">Based on Schema: "{schema.templateName}"</Typography>
            </Box>
            <Box sx={{display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap'}}>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="application/json" style={{ display: 'none' }} />
                <Button size="small" variant="outlined" startIcon={<UploadFileIcon />} onClick={handleImportClick}>Import</Button>
                <Button size="small" variant="outlined" startIcon={<FavoriteIcon />} onClick={() => setFavoritesOpen(true)} disabled={favoriteNodeIds.length === 0}>Favs ({favoriteNodeIds.length})</Button>
                <Button size="small" variant="outlined" startIcon={<ViewListIcon />} onClick={() => setIsListDialogOpen(true)}>Lists</Button>
                <Tooltip title="Show Validation Errors"><IconButton onClick={() => setErrorDialogOpen(true)} color="error"><Badge badgeContent={validationErrors.length} color="error"><WarningIcon /></Badge></IconButton></Tooltip>
            </Box>
        </Box>
        <FormControlLabel control={<Switch size="small" checked={showRequirements} onChange={() => setShowRequirements(prev => !prev)} />} label="Show Requirements" sx={{flexShrink: 0}} />
        <TextField label="Search Instance Nodes..." fullWidth value={searchTerm} onChange={e => setSearchTerm(e.target.value)} margin="normal" sx={{flexShrink: 0}} />
        <Box sx={{ border: '1px solid #ddd', borderRadius: 1, flexGrow: 1, overflowY: 'auto', p: 1, my: 2 }}>
            <List dense>{detailedTree.map(node => <InstanceTreeNode key={node.id} node={node} level={0} />)}</List>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexShrink: 0 }}>
            <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={onBackToSchema}>Back to Schema</Button>
            <Button variant="contained" color="secondary" startIcon={<SaveIcon />} onClick={handleExportInstance}>Export Instance</Button>
        </Box>
        </Paper>
        <ContentPanel 
            node={selectedNode} 
            schema={schema} 
            onNodeNameChange={handleNodeNameChange}
            onContentChange={handleContentChange}
        />

      {/* Dialogs and Menus */}
      <Menu anchorEl={listMenuAnchorEl} open={Boolean(listMenuAnchorEl)} onClose={handleCloseListMenu}>
        {Object.keys(customLists).length === 0 && <MenuItem disabled>No lists created yet.</MenuItem>}
        {Object.keys(customLists).map(listName => (
          <MenuItem key={listName} onClick={() => handleToggleNodeInList(listName)}>
            <Checkbox checked={customLists[listName]?.includes(nodeForListMenu?.id)} />
            <ListItemText>{listName}</ListItemText>
          </MenuItem>
        ))}
      </Menu>

      <Dialog open={isListDialogOpen} onClose={() => setIsListDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Manage Custom Lists</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField label="New List Name" value={newListName} onChange={e => setNewListName(e.target.value)} size="small" fullWidth />
            <Button onClick={handleCreateList} variant="contained">Create</Button>
          </Box>
          {Object.keys(customLists).length === 0 ? <Typography>No lists yet. Create one above.</Typography> :
            Object.entries(customLists).map(([listName, nodeIds]) => (
              <Paper key={listName} variant="outlined" sx={{p:1, mb: 1}}>
                <Typography variant="h6">{listName}</Typography>
                <List dense>
                  {nodeIds.length === 0 ? <ListItem><ListItemText secondary="No items in this list." /></ListItem> : 
                    nodeIds.map(nodeId => {
                      const node = nodes.find(n => n.id === nodeId);
                      return node ? <ListItem button key={nodeId} onClick={() => handleNavigateToListedNode(nodeId)}><ListItemText primary={node.name} /></ListItem> : null;
                    })
                  }
                </List>
              </Paper>
            ))
          }
        </DialogContent>
        <DialogActions><Button onClick={() => setIsListDialogOpen(false)}>Close</Button></DialogActions>
      </Dialog>
      
      <Dialog open={favoritesOpen} onClose={() => setFavoritesOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Favorite Nodes</DialogTitle>
        <DialogContent dividers>
            <List>{favoriteNodeIds.map(favId => { const favNode = nodes.find(n => n.id === favId); if (!favNode) return null; return (<ListItem button key={favId} onClick={() => handleFavoriteSelect(favId)}><ListItemText primary={favNode.name} /></ListItem>);})}</List>
        </DialogContent>
        <DialogActions><Button onClick={() => setFavoritesOpen(false)}>Close</Button></DialogActions>
      </Dialog>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Add Instance Node</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Allowed Node Type</InputLabel>
            <Select value={childSchemaNodeId} label="Allowed Node Type" onChange={e => { const schemaNode = possibleChildren.find(c => c.id === e.target.value); setChildSchemaNodeId(schemaNode.id); setChildName(schemaNode.name);}}>
              {possibleChildren.map(pc => <MenuItem key={pc.id} value={pc.id}>{pc.name}</MenuItem>)}
            </Select>
          </FormControl>
          {selectedNodeType && (<Paper variant="outlined" sx={{ p: 2, mt: 1, display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'action.hover' }}><InfoIcon color="primary" /><Box><Typography variant="subtitle2">{selectedNodeType.name}</Typography><Typography variant="body2" color="text.secondary">{selectedNodeType.description}</Typography></Box></Paper>)}
          <TextField label="Instance Name" fullWidth value={childName} onChange={e => setChildName(e.target.value)} margin="normal" sx={{mt: 2}}/>
        </DialogContent>
        <DialogActions><Button onClick={() => setDialogOpen(false)}>Cancel</Button><Button onClick={addInstanceNode} variant="contained">Add</Button></DialogActions>
      </Dialog>
      
      <Dialog open={errorDialogOpen} onClose={() => setErrorDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Schema Validation Errors</DialogTitle>
        <DialogContent dividers>
          {validationErrors.length > 0 ? (
            <List>{validationErrors.map(error => (<ListItem key={error.id} divider><ListItemIcon><ErrorIcon color="error" /></ListItemIcon><ListItemText primary={`Missing children in "${error.parentNodeName}"`} secondary={`Requires at least ${error.minCount} of "${error.requiredChildName}", but found ${error.currentCount}.`} /></ListItem>))}</List>
          ) : ( <Typography sx={{p: 2, textAlign: 'center'}}>No validation errors found.</Typography>)}
        </DialogContent>
        <DialogActions><Button onClick={() => setErrorDialogOpen(false)}>Close</Button></DialogActions>
      </Dialog>
      
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent><Typography>Are you sure you want to delete the instance "<strong>{nodeToDelete?.name}</strong>"? This will also delete all its children.</Typography></DialogContent>
        <DialogActions><Button onClick={() => setConfirmOpen(false)}>Cancel</Button><Button onClick={handleDeleteConfirm} variant="contained" color="error">Delete</Button></DialogActions>
      </Dialog>
    </Box>
  );
}

function ContentPanel({ node, schema, onNodeNameChange, onContentChange }) {
    if (!node) {
        return (
            <Paper sx={{ p: 2, m: 2, width: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography color="text.secondary">Select a node to see its content</Typography>
            </Paper>
        );
    }

    const schemaNode = schema.nodes.find(sn => sn.id === node.schemaNodeId);
    const nodeType = schema.nodeTypes.find(nt => nt.id === schemaNode?.typeId);

    const renderField = (field) => {
        const value = node.content?.[field.id] || '';

        // For file/image, we'd store an array of objects with URL, name, etc.
        // For simplicity, we'll just show a placeholder.
        if (field.type === 'file' || field.type === 'image') {
            const count = Array.isArray(value) ? value.length : 0;
            return (
                <Box key={field.id}>
                    <Typography gutterBottom>{field.name} ({count} / {field.maxCount ?? '*'})</Typography>
                    <Button variant="outlined" startIcon={<UploadFileIcon />}>Upload {field.type}</Button>
                    <Typography variant="caption" display="block" color="text.secondary">
                        (Upload functionality is a placeholder)
                    </Typography>
                </Box>
            )
        }
        
        return (
            <TextField
                key={field.id}
                label={field.name}
                fullWidth
                multiline={field.type === 'textarea'}
                rows={field.type === 'textarea' ? 4 : 1}
                value={value}
                onChange={(e) => onContentChange(node.id, field.id, e.target.value)}
                margin="normal"
                required={field.required}
            />
        );
    }
    
    return (
        <Paper sx={{ p: 2, m: 2, width: '50%', overflowY: 'auto' }}>
            <Typography variant="h6">Content Editor</Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>Editing: {node.name}</Typography>
            <Divider sx={{my: 2}} />
            <TextField
                label="Node Name (Display Label)"
                fullWidth
                value={node.name}
                onChange={(e) => onNodeNameChange(node.id, e.target.value)}
                margin="normal"
            />
            {nodeType?.fields?.map(field => renderField(field))}
            {!nodeType?.fields || nodeType.fields.length === 0 && (
                <Typography color="text.secondary" sx={{mt: 2}}>This node type has no custom content fields defined.</Typography>
            )}
        </Paper>
    );
}

// --- TEMPLATE MANAGER (New Sidebar Component) ---

function TemplateManager({ onSchemaChange, currentSchema }) {
  const [templates, setTemplates] = useState([]);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNodeType, setEditingNodeType] = useState(null);

  useEffect(() => {
    const fetchTemplates = async () => {
        try {
            const response = await fetch('/schemas.config.json');
            if (!response.ok) throw new Error('Network response was not ok');
            const config = await response.json();
            setTemplates(config.templates);
        } catch (error) {
            console.error("Failed to fetch schemas config:", error);
            setTemplates([]);
        }
    };
    fetchTemplates();
  }, []);

  const handleTemplateSelect = async (template) => {
    try {
      const response = await fetch(template.path);
      if (!response.ok) throw new Error('Failed to load schema file');
      const schemaData = await response.json();
      onSchemaChange(schemaData);
    } catch (error) {
      console.error(`Error loading template ${template.name}:`, error);
      alert(`Could not load template: ${template.name}`);
    }
  };

  const handleOpenAddNodeType = () => {
    setEditingNodeType(null);
    setIsEditorOpen(true);
  };

  const handleOpenEditNodeType = (nodeType) => {
    setEditingNodeType(nodeType);
    setIsEditorOpen(true);
  };
  
  const handleSaveNodeType = (savedNodeType) => {
    let updatedNodeTypes;
    if (currentSchema.nodeTypes.some(nt => nt.id === savedNodeType.id)) {
        updatedNodeTypes = currentSchema.nodeTypes.map(nt => nt.id === savedNodeType.id ? savedNodeType : nt );
    } else {
        updatedNodeTypes = [...currentSchema.nodeTypes, savedNodeType];
    }
    onSchemaChange({ ...currentSchema, nodeTypes: updatedNodeTypes });
    setIsEditorOpen(false);
  };
  
  const handleDeleteNodeType = (typeId) => {
    if (currentSchema.nodes.some(n => n.typeId === typeId)) {
        alert("Cannot delete node type. It is currently being used in the schema."); return;
    }
    onSchemaChange({ ...currentSchema, nodeTypes: currentSchema.nodeTypes.filter(nt => nt.id !== typeId) });
  };

  return (
    <Box sx={{ width: 300, p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Template Manager</Typography>
      <List dense subheader={<ListSubheader>Load Template</ListSubheader>}>
        {templates.map(template => (
          <ListItem button key={template.name} onClick={() => handleTemplateSelect(template)}>
            <ListItemText primary={template.name} />
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 2 }} />
      <Box>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>Edit Node Types</Typography>
        <List dense>
            {currentSchema.nodeTypes.map(nt => (
                <ListItem key={nt.id} secondaryAction={
                    <>
                        <IconButton edge="end" size="small" onClick={() => handleOpenEditNodeType(nt)}><EditIcon fontSize="small" /></IconButton>
                        <IconButton edge="end" size="small" onClick={() => handleDeleteNodeType(nt.id)}><DeleteIcon fontSize="small" /></IconButton>
                    </>
                }>
                    <ListItemIcon sx={{minWidth: 36}}>{iconMap[nt.icon]}</ListItemIcon>
                    <ListItemText primary={nt.name} />
                </ListItem>
            ))}
        </List>
        <Button variant="outlined" size="small" fullWidth onClick={handleOpenAddNodeType} sx={{mt: 1}}>Add New Type</Button>
      </Box>

      {isEditorOpen && 
        <NodeTypeEditor
            isOpen={isEditorOpen}
            nodeType={editingNodeType}
            onClose={() => setIsEditorOpen(false)}
            onSave={handleSaveNodeType}
        />
      }
    </Box>
  );
}


// --- MAIN APP COMPONENT ---

export default function App() {
  const [mode, setMode] = useState('schema');
  const [schema, setSchema] = useState({
    templateName: 'New Template',
    nodeTypes: [ { id: 'nt_1', name: 'Default Node', icon: 'Article', description: 'A default node type.', fields: [] } ],
    nodes: [ { id: 's_node_root', parentId: null, typeId: 'nt_1', name: 'Root', minCount: 1, maxCount: 1 } ],
  });
  const [isDrawerOpen, setDrawerOpen] = useState(true);
  const [favoriteNodeIds, setFavoriteNodeIds] = useState([]);
  const [instanceNodes, setInstanceNodes] = useState([]);
  const [instanceLists, setInstanceLists] = useState({});

  const handleSchemaChange = (newSchema, isSaveOperation = false) => {
    setSchema(newSchema);
    if (!isSaveOperation) {
        setMode('schema');
        setFavoriteNodeIds([]);
    }
  };

  const handleBuildInstance = () => {
      const rootSchemaNode = schema.nodes.find(n => !n.parentId);
      if (rootSchemaNode) {
          const rootInstanceNode = {
              id: `i_node_${Date.now()}`,
              schemaNodeId: rootSchemaNode.id,
              parentId: null,
              name: rootSchemaNode.name,
              content: {},
          };
          setInstanceNodes([rootInstanceNode]);
      } else {
          setInstanceNodes([]);
      }
      setInstanceLists({});
      setFavoriteNodeIds([]);
      setMode('instance');
  };

  const handleImportInstance = (data) => {
      if(data.schemaUsed && data.instanceNodes && data.instanceFavorites && data.instanceLists) {
        setSchema(data.schemaUsed);
        setFavoriteNodeIds(data.instanceFavorites);
        setInstanceNodes(data.instanceNodes);
        setInstanceLists(data.instanceLists);
        setMode('instance');
        alert('Instance imported successfully!');
      } else {
          alert('Invalid instance file format.');
      }
  };

  return (
    <Box sx={{ display: 'flex', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <Drawer open={isDrawerOpen} onClose={() => setDrawerOpen(false)} variant="persistent">
        <TemplateManager onSchemaChange={handleSchemaChange} currentSchema={schema} />
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 0, transition: 'margin .2s', ml: isDrawerOpen ? '300px' : 0 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton color="inherit" edge="start" onClick={() => setDrawerOpen(!isDrawerOpen)} sx={{ mr: 2 }}>
                <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>Schema-Driven Tree Builder</Typography>
            <Chip icon={mode === 'schema' ? <BuildIcon /> : <CheckCircleIcon />} label={mode === 'schema' ? 'Mode: Designing Schema' : 'Mode: Creating Instance'} color={mode === 'schema' ? 'primary' : 'success'} variant="filled" />
          </Toolbar>
        </AppBar>
        
        {mode === 'schema' ? (
          <SchemaBuilder 
            initialSchema={schema} 
            onSaveSchema={handleSchemaChange} 
            onBuildInstance={handleBuildInstance}
          />
        ) : (
          <InstanceCreator 
            schema={schema} 
            onBackToSchema={() => setMode('schema')}
            favoriteNodeIds={favoriteNodeIds}
            setFavoriteNodeIds={setFavoriteNodeIds}
            nodes={instanceNodes}
            setNodes={setInstanceNodes}
            customLists={instanceLists}
            setCustomLists={setInstanceLists}
            onImportInstance={handleImportInstance}
          />
        )}
      </Box>
    </Box>
  );
}

