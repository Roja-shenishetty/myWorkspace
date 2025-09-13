import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Chip,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Stack,
  IconButton,
} from "@mui/material";
import {
  Add as PlusIcon,
  Edit as EditIcon,
  Delete as TrashIcon,
  Description as FileTextIcon,
  Image as ImageIcon,
  Link as LinkIcon,
  InsertDriveFile as FileImageIcon,
  TextFields as TypeIcon,
} from "@mui/icons-material";

const FIELD_TYPES = [
  { id: "text", name: "Text", icon: TypeIcon, description: "Single line text input" },
  { id: "textarea", name: "Text Area", icon: FileTextIcon, description: "Multi-line text input" },
  { id: "image", name: "Image", icon: ImageIcon, description: "Image upload field" },
  { id: "file", name: "File", icon: FileImageIcon, description: "File upload field" },
  { id: "url", name: "URL", icon: LinkIcon, description: "URL/link input" },
];

const ICONS = [
  "FileText",
  "Folder",
  "Image",
  "Users",
  "Settings",
  "Star",
  "Heart",
  "Book",
];

// For icon selection, MUI does not have these direct strings, so we can opt to use a simple select with text, or map to meaningful icons if wanted

export default function NodeTypeEditor({ nodeType, isOpen, onClose, onSave }) {
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

  // Helper to render an icon component from FIELD_TYPES or fallback
  const renderFieldIcon = (typeId) => {
    const fieldType = FIELD_TYPES.find((ft) => ft.id === typeId);
    const IconCmp = fieldType?.icon || TypeIcon;
    return <IconCmp sx={{ mr: 1, color: "primary.main" }} />;
  };

  // For icon select, map ICONS to string options - for simplicity, just text select here

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
                          <TrashIcon fontSize="small" />
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
