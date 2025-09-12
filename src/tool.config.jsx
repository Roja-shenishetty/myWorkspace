// src/tool.config.js
import React from 'react';
import { FaCodepen, FaCheckCircle, FaCut } from 'react-icons/fa';

import RunbookEditorIcon from './components/icons/RunbookEditorIcon';
import TerminalPlayIcon from './components/icons/TerminalPlayIcon'
import DeviceToolbarIcon from './components/icons/ToggleDeviceIcon';
import WidgetsIcon from '@mui/icons-material/Widgets';

import { FaMarkdown } from 'react-icons/fa';

export const tools = [
  {
    id: 'runbookeditor',
    icon: <RunbookEditorIcon className="text-blue-500" width="44" height="44" />,
    title: 'Runbook Doc Editor',
    description: 'Create a simple Editor to create runbook , RunbookDoc — Task flow steps .',
    tags: ['JavaScript', 'Web Tool'],
    link:"/tools/runbookeditor"
  },
  {
    id: 'infotreeeditor',
    icon: <RunbookEditorIcon className="text-blue-500" width="44" height="44" />,
    title: 'Informatin Tree Editor',
    description: 'Create a information tree structure with defined child node types.',
    tags: ['JavaScript', 'Web Tool'],
    link:"/tools/infotreeeditor"
  },
  //   {
  //   id: 'runbookmultieditor',
  //   icon: <RunbookEditorIcon className="text-blue-500" width="44" height="44" />,
  //   title: 'Runbook Multi Editor',
  //   description: 'Create a simple Editor to create runbooks , RunbookDoc — Task flow steps .',
  //   tags: ['JavaScript', 'Web Tool'],
  //   link:"/tools/runbookmultieditor"
  // },
 
  
  {
    id: 'markdowneditor',
    icon: <FaMarkdown className="text-green-500" width="44" height="44"/>,
    title: 'Markdown Editor',
    description: 'Crate markdown files with image drop ins. code highlights, copy save , export to pdf',
    tags: ['API', 'Web Tool'],
    link:"/tools/markdowneditor"
  },
    {
    id: 'markdownsimple',
    icon: <FaMarkdown className="text-green-500" width="44" height="44"/>,
    title: 'Simple Markdown',
    description: 'Crate simple markdown with code highlight support.',
    tags: ['API', 'Web Tool'],
    link:"/tools/markdownsimple"
  },
  {
    id: 'responsiveviewer',
    icon: <DeviceToolbarIcon className="text-green-500" width="44" height="44"/>,
    title: 'Responsive Viewer',
    description: 'Test how your web app is behaving with responsive viewer.',
    tags: ['Testing', 'Web Tool'],
    link:"/tools/responsiveviewer"
  },
  {
    id: 'componentexplorer',
    icon: <WidgetsIcon fontSize="medium" className="text-red-500" width="44" height="44"/>,
    title: 'Components Demo',
    description: 'Components which we are going to build.',
    tags: ['Demo', 'Web Tool'],
    link:"/tools/componentexplorer"
  },
   {
    id: 'cssextract',
    icon: <FaCut className="text-red-500" />,    
    title: 'CSS Extractor ',
    description: 'Extract CSS for a given Html element, from bundled CSS.',
    tags: ['CSS', 'Web Tool'],
    link: "/tools/cssextract"
  },
  {
    id: 'runbookrunner',
    icon: <TerminalPlayIcon className="text-green-500" width="44" height="44"/>,
    title: 'Runbook Doc Runner',
    description: 'Follow the plan, run the commands, capture every output.',
    tags: ['API', 'CLI'],
    link:"/tools/runbookrunner"
  },
];