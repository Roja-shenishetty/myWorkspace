import React from 'react';
import { Paper, Typography, List, ListItem, ListItemText, ListItemIcon, Button, Box, Tooltip, IconButton } from '@mui/material';
import { AccountTree, Launch, Person } from '@mui/icons-material';

export default function InstanceList({ title, instances, isShared = false }) {
  return (
    <Paper elevation={3} sx={{ p: 2, borderRadius: 4, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Typography variant="h5" component="h2" gutterBottom>
        {title}
      </Typography>
      <List sx={{ flexGrow: 1 }}>
        {instances.map((instance) => (
          <ListItem 
            key={instance.id}
            secondaryAction={
              <Tooltip title="Open Instance">
                 <IconButton edge="end">
                  <Launch />
                </IconButton>
              </Tooltip>
            }
          >
            <ListItemIcon>
              <AccountTree color="secondary"/>
            </ListItemIcon>
            <ListItemText 
              primary={instance.name}
              secondary={isShared ? `Shared by: ${instance.sharedBy}` : `Template: ${instance.templateName}`}
            />
          </ListItem>
        ))}
         {instances.length === 0 && (
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
