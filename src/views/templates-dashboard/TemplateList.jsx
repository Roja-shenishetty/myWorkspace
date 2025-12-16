import React from 'react';
import { Paper, Typography, List, ListItem, ListItemText, ListItemIcon, Button, Box, Tooltip, IconButton } from '@mui/material';
import { Article, Launch, Public } from '@mui/icons-material';

export default function TemplateList({ title, templates, isGlobal = false }) {
  return (
    <Paper elevation={3} sx={{ p: 2, borderRadius: 4, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Typography variant="h5" component="h2" gutterBottom>
        {title}
      </Typography>
      <List sx={{ flexGrow: 1 }}>
        {templates.map((template) => (
          <ListItem 
            key={template.id} 
            secondaryAction={
              <Tooltip title="Open Template">
                <IconButton edge="end">
                  <Launch />
                </IconButton>
              </Tooltip>
            }
          >
            <ListItemIcon>
              {isGlobal ? <Public color="primary" /> : <Article color="primary" />}
            </ListItemIcon>
            <ListItemText primary={template.name} />
          </ListItem>
        ))}
        {templates.length === 0 && (
             <ListItem>
                <ListItemText secondary={`No ${title.toLowerCase()} found.`} />
            </ListItem>
        )}
      </List>
      <Box sx={{ mt: 'auto', pt: 1, textAlign: 'right' }}>
        <Button>View All</Button>
      </Box>
    </Paper>
  );
}
