// MainLayout.js
import React from 'react';
import { Outlet, Link as RouterLink } from 'react-router-dom';
import {
  Box, Drawer, AppBar, Toolbar, Typography, List,
  ListItem, ListItemButton, ListItemIcon, ListItemText
} from '@mui/material';

// Import icons for your sidebar
import DashboardIcon from '@mui/icons-material/Dashboard';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import PaymentIcon from '@mui/icons-material/Payment';
import EventIcon from '@mui/icons-material/Event';
import TaskIcon from '@mui/icons-material/Task';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';

const drawerWidth = 240;

// List of all your pages
const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'My RSVP', icon: <HowToRegIcon />, path: '/rsvp' },
  { text: 'Donations', icon: <PaymentIcon />, path: '/donations' },
  { text: 'Calendar', icon: <EventIcon />, path: '/calendar' },
  { text: 'Tasks', icon: <TaskIcon />, path: '/tasks' },
  { text: 'Gallery', icon: <PhotoLibraryIcon />, path: '/gallery' },
  { text: 'Recognize Friend', icon: <SentimentSatisfiedAltIcon />, path: '/recognize' },
];

export default function MainLayout() {
  return (
    <Box sx={{ display: 'flex' }}>
      {/* 1. TOP APP BAR */}
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Alumni Reunion 2026
          </Typography>
        </Toolbar>
      </AppBar>

      {/* 2. SIDEBAR */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar /> {/* A spacer to push list below app bar */}
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

      {/* 3. MAIN CONTENT AREA */}
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
        <Toolbar /> {/* A spacer to push content below app bar */}
        
        {/* --- THIS IS WHERE YOUR PAGES RENDER --- */}
        <Outlet />
      </Box>
    </Box>
  );
}