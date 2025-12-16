import React, { useState,useEffect } from "react";
import MDEditor from "@uiw/react-md-editor";
import "./MDEditorResponsive.css"; // custom style overrides


const MarkdownEditorWithToolbar = ({content="### Heading", onChange}) => {
  const [value, setValue] = useState(content);
   // Sync prop updates
  useEffect(() => {
    //setValue(content);
   // console.log("content",value)
    onChange(value); 
  }, [value]);

//console.log("content is....",value)
  return (
    <div style={{height:500}} className="md-editor-wrapper markdown-container" 
     data-color-mode="light" >
      <MDEditor height={500} value={value} onChange={setValue} />

    </div>
  );
};

export default MarkdownEditorWithToolbar;
