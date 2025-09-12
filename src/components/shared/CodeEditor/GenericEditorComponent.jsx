import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { html } from "@codemirror/lang-html";
import { markdown } from "@codemirror/lang-markdown";

function getLanguageExtension(language) {
  switch (language) {
    case "javascript":
    case "jsx":
      return javascript({ jsx: true });
    case "typescript":
      return javascript({ typescript: true });
    case "python":
      return python();
    case "jinja2":  
    case "django":
    case "html":
      return html();
    case "markdown":
      return markdown();
    case "shell":
    case "bash":
      return null;
    default:
      return null; // No highlighting, plain text fallback
  }
}

export default function GenericCodeEditor({
  value,
  onChange,
  language = "javascript",
  height = "150px",
  width = "100%",
  theme = "light",
  fontSize = 14,
}) {
  const extension = getLanguageExtension(language);

  return (
    <div style={{ width }}>
      <CodeMirror
        value={value}
        height={height}
        extensions={extension ? [extension] : []}
        theme={theme === "dark" ? "dark" : "light"}
        onChange={onChange}
        basicSetup={{
          lineNumbers: true,
          foldGutter: true,
          autocompletion: true,
        }}
        style={{
          fontSize: fontSize,
        }}
      />
    </div>
  );
}
