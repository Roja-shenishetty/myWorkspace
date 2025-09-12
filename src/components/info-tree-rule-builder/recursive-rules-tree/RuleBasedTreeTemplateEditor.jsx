import React, { useState, useCallback, useMemo } from 'react';
import {
  Box, Button, Card, CardContent, Typography, FormControl, InputLabel, Select,
  MenuItem, TextField, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  List, ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip
} from '@mui/material';
import {
    AddCircle as AddCircleIcon,
    Delete as DeleteIcon,
    Save as SaveIcon,
    Folder as FolderIcon,
    Article as ArticleIcon,
    ChevronRight as ChevronRightIcon,
    Comment as CommentIcon
} from '@mui/icons-material';
import NodeTypeEditorFullAppMain from './simple-rules-tree/NodeTypeEditorFullAppMain'

// --- Icon Mapping & Theme ---
const iconMap = {
  Folder: <FolderIcon />,
  ChevronRight: <ChevronRightIcon />,
  Comment: <CommentIcon />,
  Article: <ArticleIcon />,
};
const iconNames = Object.keys(iconMap);


// --- Initial Data ---
const defaultNodeTypes = [
  { id: 'nt_proj_1', name: 'Project', icon: 'Folder', description: 'Top-level container', validChildren: [{ childTypeId: 'nt_feat_2', maxCount: 10 }], maxTotalChildren: 50 },
  { id: 'nt_feat_2', name: 'Feature', icon: 'ChevronRight', description: 'A piece of functionality', validChildren: [{ childTypeId: 'nt_subf_3', maxCount: null }], maxTotalChildren: 20 },
  { id: 'nt_subf_3', name: 'Sub-Feature', icon: 'ChevronRight', description: 'A smaller part of a feature', validChildren: [], maxTotalChildren: 10 },
];

// --- Helper to find node type by id ---
const findNodeType = (nodeTypes, id) => nodeTypes.find(nt => nt.id === id);

// --- CORE RECURSIVE EDITOR (Based on your logic) ---
function RecursiveRuleEditor({ nodeType, nodeTypes, updateNodeType, path = 'root' }) {
 

const availableChildTypes = nodeTypes.filter(nt =>
  !nodeType.validChildren?.some(vc => vc.childTypeId === nt.id)
);


  
const [isAddChildDialogOpen, setAddChildDialogOpen] = React.useState(false);
const [candidateChild, setCandidateChild] = React.useState(availableChildTypes[0]?.id || '');

 if (!nodeType) return null;

  const handleAddChildRule = () => {
    console.log("Adding.. new child....");
   
    if (availableChildTypes.length === 0) {
      alert('No more available child types to add.');
      return;
    }
    console.log("Available child nodes...", availableChildTypes[0])
    const newChild = { childTypeId: availableChildTypes[0].id, maxCount: null };

     console.log("new nodeType..", nodeType)
          alert("adding new child.....",newChild, nodeType)
    updateNodeType({ ...nodeType, validChildren: [...(nodeType.validChildren || []), newChild] });
  };

  const handleRemoveChildRule = (childTypeId) => {
    updateNodeType({
      ...nodeType,
      validChildren: nodeType.validChildren.filter(vc => vc.childTypeId !== childTypeId),
    });
  };

  const handleChangeChildType = (index, newChildTypeId) => {
    if (nodeType.validChildren.some((vc, i) => vc.childTypeId === newChildTypeId && i !== index)) {
      alert('This child type is already added.');
      return;
    }
    const newChildren = nodeType.validChildren.map((vc, i) =>
      i === index ? { ...vc, childTypeId: newChildTypeId } : vc
    );
    updateNodeType({ ...nodeType, validChildren: newChildren });
  };

  const handleChangeMaxCount = (index, val) => {
    const trimmed = val.trim();
    const maxCount = trimmed === '*' || trimmed === '' ? null : Number(trimmed);
    if (maxCount !== null && (isNaN(maxCount) || maxCount < 0)) return;
    const newChildren = nodeType.validChildren.map((vc, i) =>
      i === index ? { ...vc, maxCount } : vc
    );
    updateNodeType({ ...nodeType, validChildren: newChildren });
  };

  const handleOpenAddDialog = () => {
  if (availableChildTypes.length === 0) {
    alert('No more available child types to add.');
    return;
  }
  setCandidateChild(availableChildTypes[0]?.id || '');
  setAddChildDialogOpen(true);
};

const handleConfirmAddChild = () => {
  if (!candidateChild) {
    alert('Please select a child node type.');
    return;
  }
  const newChild = { childTypeId: candidateChild, maxCount: null };
  updateNodeType({ ...nodeType, validChildren: [...(nodeType.validChildren || []), newChild] });
  setAddChildDialogOpen(false);
};

  return (
    <Box sx={{ borderLeft: 2, borderColor: 'grey.200', pl: 2, pt: 1, mt: 1 }}>
      {nodeType.validChildren?.map((childRule, idx) => {
        const childNode = findNodeType(nodeTypes, childRule.childTypeId);
        if (!childNode) return null;
        const key = `${path}-${childRule.childTypeId}-${idx}`;
        return (
          <Card key={key} variant="outlined" sx={{ my: 1, p: 1, bgcolor: 'grey.50' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Tooltip title={childNode.name}>
                {iconMap[childNode.icon]}
              </Tooltip>
              <FormControl sx={{ minWidth: 180 }} size="small">
                <InputLabel>Child Type</InputLabel>
                <Select
                  value={childRule.childTypeId}
                  onChange={e => handleChangeChildType(idx, e.target.value)}
                  label="Child Type"
                >
                  {/* Logic to ensure the dropdown shows available options + the current one */}
                  {nodeTypes.filter(nt =>
                    nt.id !== nodeType.id &&
                    (!nodeType.validChildren.some((vc, i) => vc.childTypeId === nt.id && i !== idx))
                  ).concat(childNode).map(nt => (
                    <MenuItem key={nt.id} value={nt.id}>{nt.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Max"
                value={childRule.maxCount === null ? '*' : childRule.maxCount}
                onChange={e => handleChangeMaxCount(idx, e.target.value)}
                size="small"
                sx={{ width: 80 }}
                placeholder="*"
              />
              <IconButton color="error" onClick={() => handleRemoveChildRule(childRule.childTypeId)} size="small">
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
            <RecursiveRuleEditor
              nodeType={childNode}
              nodeTypes={nodeTypes}
              updateNodeType={updateNodeType}
              path={key}
            />
          </Card>
        );
      })}
     
      <Button startIcon={<AddCircleIcon />} onClick={handleOpenAddDialog} sx={{ mt: 2 }}>
  Add Child Rule
</Button>


<Dialog open={isAddChildDialogOpen} onClose={() => setAddChildDialogOpen(false)} fullWidth maxWidth="xs">
  <DialogTitle>Select Child Node Type to Add</DialogTitle>
  <DialogContent dividers>
    <FormControl fullWidth>
      <InputLabel>Child Node Type</InputLabel>
      <Select
        value={candidateChild}
        label="Child Node Type"
        onChange={e => setCandidateChild(e.target.value)}
      >
        {availableChildTypes.map(nt => (
          <MenuItem key={nt.id} value={nt.id}>{nt.name}</MenuItem>
        ))}
      </Select>
    </FormControl>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setAddChildDialogOpen(false)}>Cancel</Button>
    <Button variant="contained" onClick={handleConfirmAddChild}>Add</Button>
  </DialogActions>
</Dialog>

    </Box>
  );
}


// --- Main App Component ---
export default function RuleBasedTreeTemplateEditor() {
  const [nodeTypes, setNodeTypes] = useState(defaultNodeTypes);
  const [selectedNodeTypeId, setSelectedNodeTypeId] = useState(nodeTypes[0]?.id);
  const [templateName, setTemplateName] = useState('My New Project Template');
  const [jsonExportOpen, setJsonExportOpen] = useState(false);
  const [jsonExportText, setJsonExportText] = useState('');

  const updateNodeType = useCallback(updatedNode => {
    setNodeTypes(prev => prev.map(nt => nt.id === updatedNode.id ? updatedNode : nt));
  }, []);

  const selectedNodeType = useMemo(() => findNodeType(nodeTypes, selectedNodeTypeId), [nodeTypes, selectedNodeTypeId]);



  const handleExport = () => {
    if (!templateName.trim()) {
      alert('Please enter a template name.');
      return;
    }
    setJsonExportText(JSON.stringify({ templateName, nodeTypes }, null, 2));
    setJsonExportOpen(true);
  };
  
  const handleAddNodeType = () => {
    const newId = `nt_${Date.now()}`;
    const newNodeType = {
        id: newId,
        name: 'New Type',
        icon: 'Article',
        description: '',
        validChildren: [],
        maxTotalChildren: null
    };
    setNodeTypes([...nodeTypes, newNodeType]);
    setSelectedNodeTypeId(newId);
  };
  
  const handleDeleteNodeType = (idToDelete) => {
    if (window.confirm("Are you sure you want to delete this node type? This may affect other types that reference it.")) {
        const remaining = nodeTypes.filter(nt => nt.id !== idToDelete);
        const cleaned = remaining.map(nt => ({
            ...nt,
            validChildren: nt.validChildren.filter(vc => vc.childTypeId !== idToDelete)
        }));
        setNodeTypes(cleaned);
        if (selectedNodeTypeId === idToDelete) {
            setSelectedNodeTypeId(cleaned[0]?.id || null);
        }
    }
  };
  
  const handleUpdateSelectedNode = (field, value) => {
    updateNodeType({ ...selectedNodeType, [field]: value });
  };
   const handleMaxTotalChildrenChange = (e) => {
    let val = e.target.value.trim();
    let count = val === '*' || val === '' ? null : Number(val);
    if (count !== null && (isNaN(count) || count < 0)) return;
    updateNodeType({ ...selectedNodeType, maxTotalChildren: count });
  };


  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 4, bgcolor: 'grey.100', minHeight: '100vh' }}>
      <Typography variant="h4" textAlign="center" mb={1}>Recursive Rule Editor</Typography>
      <Typography color="text.secondary" textAlign="center" mb={3}>Define project templates with nested rules.</Typography>

      <TextField
        label="Template Name"
        fullWidth
        value={templateName}
        onChange={e => setTemplateName(e.target.value)}
        margin="normal"
        sx={{ bgcolor: 'white' }}
      />
      
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 2fr' }, gap: 3 }}>
        
        {/* Left Panel: Node Type Management */}
        <Card variant="outlined">
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="h6">Node Types</Typography>
                    <Button startIcon={<AddCircleIcon />} onClick={handleAddNodeType} size="small">Add</Button>
                </Box>
                <List>
                    {nodeTypes.map(nt => (
                        <ListItem key={nt.id} disablePadding secondaryAction={
                            <IconButton edge="end" onClick={() => handleDeleteNodeType(nt.id)}><DeleteIcon /></IconButton>
                        }>
                            <ListItemButton selected={selectedNodeTypeId === nt.id} onClick={() => setSelectedNodeTypeId(nt.id)}>
                                <ListItemIcon>{iconMap[nt.icon]}</ListItemIcon>
                                <ListItemText primary={nt.name} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </CardContent>
        </Card>

        {/* Right Panel: Editor */}
        {selectedNodeType && (
          <Card variant="outlined" sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>Editing: {selectedNodeType.name}</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: {xs: '1fr', sm: '1fr 1fr'}, gap: 2, mb: 2}}>
                <TextField label="Name" value={selectedNodeType.name} onChange={e => handleUpdateSelectedNode('name', e.target.value)} size="small" />
                <FormControl size="small">
                    <InputLabel>Icon</InputLabel>
                    <Select value={selectedNodeType.icon} label="Icon" onChange={e => handleUpdateSelectedNode('icon', e.target.value)}>
                        {iconNames.map(name => <MenuItem key={name} value={name}>{name}</MenuItem>)}
                    </Select>
                </FormControl>
                <TextField label="Description" value={selectedNodeType.description} onChange={e => handleUpdateSelectedNode('description', e.target.value)} size="small" sx={{ gridColumn: '1 / -1'}}/>
                 <TextField
                    label="Max Total Children (* = unlimited)"
                    value={selectedNodeType.maxTotalChildren === null ? '*' : selectedNodeType.maxTotalChildren}
                    onChange={handleMaxTotalChildrenChange}
                    size="small"
                    sx={{ gridColumn: '1 / -1'}}
                />
            </Box>
            <RecursiveRuleEditor
              nodeType={selectedNodeType}
              nodeTypes={nodeTypes}
              updateNodeType={updateNodeType}
              path={selectedNodeTypeId}
            />
          </Card>
        )}
      </Box>

      <Box textAlign="center" mt={4}>
        <Button variant="contained" size="large" startIcon={<SaveIcon />} onClick={handleExport}>
          Export Template JSON
        </Button>
      </Box>

      {/* Export Dialog */}
      <Dialog open={jsonExportOpen} onClose={() => setJsonExportOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Exported Template JSON</DialogTitle>
        <DialogContent dividers>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxHeight: 500, overflowY: 'auto' }}>
            {jsonExportText}
          </pre>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setJsonExportOpen(false)}>Close</Button>
          <Button
            variant="contained"
            onClick={() => {
              navigator.clipboard.writeText(jsonExportText);
              alert('Template JSON copied to clipboard!');
            }}
          >
            Copy JSON
          </Button>
        </DialogActions>
      </Dialog>

      <NodeTypeEditorFullAppMain></NodeTypeEditorFullAppMain>
    </Box>
  );
}