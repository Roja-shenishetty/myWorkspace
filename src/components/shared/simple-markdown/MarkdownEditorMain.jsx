
import React , {useState,useEffect} from 'react';
import { Box, Typography , Button} from '@mui/material';
import MarkdownViewer from './MarkdownViewer';
import YouTubeIcon from '@mui/icons-material/YouTube';

import MDEditor from '@uiw/react-md-editor';
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

export default function Editor() {
  const [value, setValue] = useState("");
  return (
    <div className="editor-container">
      <MDEditor
        value={value}
        onChange={setValue}
        height={500}
      />
    </div>
  );
}

