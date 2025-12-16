import React from 'react';
import { Outlet, Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import {
  Box, Drawer, AppBar, Toolbar, Typography, List,
  ListItem, ListItemButton, ListItemIcon, ListItemText,
  IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Import icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import PaymentIcon from '@mui/icons-material/Payment';
import EventIcon from '@mui/icons-material/Event';
import TaskIcon from '@mui/icons-material/Task';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';

const drawerWidth = 240;

// This is the layout for a *single* selected event.
// It shows the sidebar with event-specific links.
export default function EventModuleLayout() {
  // Get the specific eventId from the URL!
  const { eventId } = useParams();
  const navigate = useNavigate();

  // These links now all depend on the eventId
  const menuItems = [
    { text: 'Event Home', icon: <DashboardIcon />, path: `/events/${eventId}` },
    { text: 'RSVP', icon: <HowToRegIcon />, path: `/events/${eventId}/rsvp` },
    { text: 'Donations', icon: <PaymentIcon />, path: `/events/${eventId}/donations` },
    { text: 'Calendar', icon: <EventIcon />, path: `/events/${eventId}/calendar` },
    { text: 'Tasks', icon: <TaskIcon />, path: `/events/${eventId}/tasks` },
    { text: 'Gallery', icon: <PhotoLibraryIcon />, path: `/events/${eventId}/gallery` },
    { text: 'Recognize Friend', icon: <SentimentSatisfiedAltIcon />, path: `/events/${eventId}/recognize` },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Event Management
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        sx={{ width: drawerWidth, flexShrink: 0, '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' }}}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
           <IconButton onClick={() => navigate('/events')} sx={{ mr: 1 }}>
             <ArrowBackIcon />
           </IconButton>
           <Typography variant="subtitle1">Back to Events</Typography>
        </Box>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton component={RouterLink} to={item.path}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
        <Toolbar />
        
        {/* THIS IS THE MAGIC:
          The Outlet renders the child route (e.g., EventHome).
          We pass the 'eventId' to it using the 'context' prop.
        */}
        <Outlet context={{ eventId }} />
      </Box>
    </Box>
  );
}