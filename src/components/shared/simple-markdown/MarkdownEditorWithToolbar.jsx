import React, { useState,useEffect } from "react";
import MDEditor from "@uiw/react-md-editor";
import "./MDEditorResponsive.css"; // custom style overrides
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery"

const MarkdownEditorWithToolbar = ({content="### Heading", onChange}) => {
  const [value, setValue] = useState(content);
   // Sync prop updates
  useEffect(() => {
    //setValue(content);
   // console.log("content",value)
    onChange(value); 
  }, [value]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
//console.log("content is....",value)
  return (
    <div style={{height:500}} className="md-editor-wrapper markdown-container" 
     data-color-mode="light" >
      <MDEditor height={500} value={value} onChange={setValue}  view={{ menu: true, md: true, html: false }}  preview={isMobile ? "preview" : "edit"} hideToolbar={isMobile}/>
   </div>
  );
};

export default MarkdownEditorWithToolbar;
