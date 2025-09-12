import React, { useState, useRef } from 'react';
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  TextField,
  Grid,
  InputAdornment,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import FullscreenIcon from '@mui/icons-material/Fullscreen';

// Adjust the import path as needed
import UrlDropPreviewCard from '../components/shared/UrlDropPreviewCard/UrlDropPreviewCard';

// --- Mock Data (same as before) ---
const mockData = [
    {
      category: 'Git Basics',
      videos: [
         {
          id: 'git-1',
          title: 'Brief introduction to Git',
          description: 'Understand the staging area and how to save your work.',
          thumbnail: 'https://i.ytimg.com/vi/BGGOn-zpenY/hqdefault.jpg',
          url: 'https://youtu.be/r8jQ9hVA2qs?si=e5zwzpALcXAWVd-w',
        },
        {
          id: 'git-2',
          title: 'Initializing a Repository',
          description: 'Learn how to start a new Git project from scratch.',
          thumbnail: 'https://i.ytimg.com/vi/2ReR1YJrNOM/hqdefault.jpg',
          url: 'https://www.youtube.com/watch?v=2ReR1YJrNOM',
        },
        {
          id: 'git-3',
          title: 'Git Basics in 1 hour',
          description:'learning in telugu',
          thumbnail: 'https://i.ytimg.com/vi/2ReR1YJrNOM/hqdefault.jpg',
          url: 'https://youtu.be/LGLuHYHbCFA?si=ZE-7q6fjdk-PvCHv',
        },
        {
              id: 'git-4',
          title: 'Github a crash course',
          description: 'Crash Course on Git..',
          thumbnail: 'https://i.ytimg.com/vi/2ReR1YJrNOM/hqdefault.jpg',
          url: 'https://youtu.be/vA5TTz6BXhY?si=MMETCaVNaZUnbLgU',
            
        }

        
       
      ],
    },
    {
      category: 'Advanced Git Concepts',
      videos: [
        {
          id: 'adv-1',
          title: 'Mastering Rebasing',
          description: 'Keep your commit history clean and linear with rebase.',
          thumbnail: '',
          url: 'https://youtu.be/DkWDHzmMvyg?si=rC4N2X7ghHwvhPmN',
        },
      ],
    },
  ];

const drawerWidth = 240;

export default function GuidesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentVideo, setCurrentVideo] = useState(mockData[0]?.videos[0]);
  const playerContainerRef = useRef(null);

  const filteredData = mockData
    .map(category => ({
      ...category,
      videos: category.videos.filter(video =>
        video.title.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter(category => category.videos.length > 0);


  return (
    <Box className="flex bg-slate-50 min-h-screen">

      {/* --- Main Content --- */}
      <Box component="main" className="flex-grow p-4 md:p-6" sx={{ width: { sm: `calc(100% - ${drawerWidth}px)` } }}>

        {/* --- Inline Video Player Section --- */}
        {currentVideo && (
          <Box className="mb-8 relative" ref={playerContainerRef}>
         
            <Typography variant="h5" className="font-bold mb-2">{currentVideo.title}</Typography>
      
            <UrlDropPreviewCard
              value={{ url: currentVideo.url, description: currentVideo.description }}
              showJustUrl={true}
              printMode={true}
              width="100%"
            />
            
          </Box>
        )}

        <TextField fullWidth variant="outlined" placeholder="Search guides..." 
        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} 
        className="mb-8" InputProps={{ startAdornment: (<InputAdornment position="start">
        <SearchIcon /></InputAdornment>) }}/>


        {/* --- Video Playlist Section --- */}
        <div className="space-y-10">
          {filteredData.length > 0 ? (
            filteredData.map((category) => (
              <section key={category.category} id={category.category.replace(/\s+/g, '-')}>
                <Typography variant="h4" component="h2" className="font-bold mb-4 pb-2 border-b-2 border-slate-200">{category.category}</Typography>
                <Grid container spacing={3}>
                  {category.videos.map((video) => (
                    <Grid item xs={12} sm={6} md={4} key={video.id}>
                      <Box
                        onClick={() => setCurrentVideo(video)}
                        className={`cursor-pointer rounded-lg transition-all duration-300 ${currentVideo?.id === video.id ? 'ring-2 ring-blue-500' : 'ring-1 ring-transparent hover:ring-gray-300'}`}
                        sx={{ p: 0.5, height: '100%' }}
                      >
                        <UrlDropPreviewCard
                          value={{ url: video.url, description: video.title }}
                          showJustUrl={true}
                          printMode={true}
                          width="100%"

                        />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </section>
            ))
          ) : (
            <Typography>No guides found for "{searchTerm}".</Typography>
          )}
        </div>
      </Box>
    </Box>
  );
}