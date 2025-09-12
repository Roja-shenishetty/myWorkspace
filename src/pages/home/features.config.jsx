// src/tool.config.js
import React from 'react';
import RunbookEditorIcon from '../../components/icons/RunbookEditorIcon';
import TerminalPlayIcon from '../../components/icons/TerminalPlayIcon'
import DeviceToolbarIcon from '../../components/icons/ToggleDeviceIcon';
import WidgetsIcon from '@mui/icons-material/Widgets';

import { FaMarkdown } from 'react-icons/fa';

export const features = [
  {
    id: 'freelearning',
    logoUrl: "01_iLearn_FreeLearning.png",
    title: 'Free Content.',
    description: '"Unlock a world of knowledge, for free."',
    slink:"/features/freelearning"
  },
  {
    id: 'collaborative',
    logoUrl: "02_iLearn_CollaborativeLearning.png",
    title: 'Collaborative Learning',
    description: '"Learn together, grow together."',
    slink:"/features/collaborative"
  },
  {
    id: 'create',
    logoUrl: "03_iLearn_CreateCoursesTeach.png",
    title: 'Create & Teach',
    description: '"Share your passion. Teach the world.."',
    slink:"/features/collaborative"
  },

   {
    id: 'AI Assisted',
    logoUrl: '04_iLearn_AIAssistedLearning.png',
    title: 'AI Assisted Learning',
    description: '"Share your passion. Teach the world.."',
    slink:"/features/collaborative"
  },
  {
    id: 'Parents Partner',
    logoUrl: '05_iLearn_360DegreeMonitoringTrackProgress.png',
    title: '360-Degree Monitoring',
    description: '"iLearn: A parent\'s partner in learning.."',
    slink:"/features/collaborative"
  },
    {
    id: 'hirementor',
    logoUrl: 'public/06_iLearn_HireAMentor_Monitor.png',
    title: 'Hire a mentor',
    description: '"Unlock your potential with one-on-one mentorship.."',
    slink:"/features/hirementor"
  },


];