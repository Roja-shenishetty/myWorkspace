import React, { useRef, useState, useEffect } from "react";
import Editor from "@monaco-editor/react";

export default function MonacoPreviewCode({ code, language }) {
  const editorRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [decorations, setDecorations] = useState([]);
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const copyTimeoutRef = useRef(null);

  function handleEditorDidMount(editor) {
    editorRef.current = editor;
  }

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    const model = editor.getModel();
    if (!model) return;

    let newDecorations = [];

    if (searchTerm) {
      const regex = new RegExp(searchTerm, "gi");
      let match;
      const ranges = [];

      const fullText = model.getValue();

      while ((match = regex.exec(fullText))) {
        const startPos = model.getPositionAt(match.index);
        const endPos = model.getPositionAt(match.index + match[0].length);

        ranges.push({
          range: {
            startLineNumber: startPos.lineNumber,
            startColumn: startPos.column,
            endLineNumber: endPos.lineNumber,
            endColumn: endPos.column,
          },
          options: {
            inlineClassName: "myHighlightClass",
          },
        });
      }

      newDecorations = editor.deltaDecorations(decorations, ranges);
      setDecorations(newDecorations);
    } else {
      newDecorations = editor.deltaDecorations(decorations, []);
      setDecorations(newDecorations);
    }
  }, [searchTerm]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    copyTimeoutRef.current = setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      style={{
        position: "relative",
        border: "1px solid #ddd",
        borderRadius: 4,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 8,
          padding: 8,
          backgroundColor: "#f5f5f5",
          borderBottom: "1px solid #ddd",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            fontWeight: "600",
            fontSize: "0.9rem",
            whiteSpace: "nowrap",
            userSelect: "none",
            color: "#333",
          }}
          title="Programming language"
        >
          {language === "jinja2" ? "HTML" : language.toUpperCase()}
        </div>

        <input
          type="search"
          placeholder="Search in file..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flexGrow: 1,
            minWidth: "150px",
            padding: "4px 8px",
            borderRadius: 4,
            border: "1px solid #ccc",
          }}
          aria-label="Search code"
        />

        <button
          onClick={() => setExpanded(!expanded)}
          title={expanded ? "Collapse code" : "Expand code"}
          style={{
            padding: "4px 8px",
            cursor: "pointer",
            borderRadius: 4,
            border: "1px solid #ccc",
            backgroundColor: "#fff",
          }}
        >
          {expanded ? "Collapse" : "Expand"}
        </button>

        <button
          onClick={handleCopy}
          title="Copy code"
          style={{
            padding: "4px 8px",
            cursor: "pointer",
            borderRadius: 4,
            border: "1px solid #ccc",
            backgroundColor: "#fff",
            minWidth: 60,
          }}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      <Editor
        height={expanded ? "60vh" : "300px"}
        language={language === "jinja2" ? "html" : language}
        value={code}
        theme="vs-dark"
        options={{
          readOnly: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          wordWrap: "on",
          renderLineHighlight: "none",
        }}
        onMount={handleEditorDidMount}
      />

      <style>{`
        .myHighlightClass {
          background-color: yellow;
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
}
