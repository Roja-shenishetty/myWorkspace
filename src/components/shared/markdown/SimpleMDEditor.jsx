// src/SimpleMDEditor.jsx
import { useState } from 'react';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';

export default function SimpleMDEditor() {
  const [text, setText] = useState("# Hello, React 19!");

  return (
    <div style={{ maxWidth: 700, margin: '2rem auto' }}>
      <SimpleMDE
        value={text}
        onChange={setText}
        options={{
          spellChecker: false,
          placeholder: "Type some *markdown* here…",
          toolbar: ["bold", "italic", "|", "preview", "side-by-side", "fullscreen"],
        }}
      />
    </div>
  );
}
