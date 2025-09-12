import React, { useState, useMemo } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function CodeBlock({ code, language, id }) {
  const [expanded, setExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");


  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };


  // Split code lines for search highlighting
  const highlightedLines = useMemo(() => {
    if (!searchTerm) return code.split("\n");
    const lowerSearch = searchTerm.toLowerCase();
    return code.split("\n").map((line) =>
      line.toLowerCase().includes(lowerSearch) ? (
        <mark key={line} style={{ backgroundColor: "#ffeaa7" }}>
          {line}
        </mark>
      ) : (
        line
      )
    );
  }, [code, searchTerm]);

  return (
    <div className="relative border border-gray-300 rounded-lg bg-gray-50 text-sm group">
      <div className="flex items-center gap-2 p-1 border-b border-gray-300 bg-gray-200 rounded-t">
        <input
          type="search"
          placeholder="Search code..."
          className="flex-grow p-1 rounded border"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <button
          title={expanded ? "Collapse Code" : "Expand Code"}
          className="px-2 py-1 text-gray-600 hover:text-gray-900"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Collapse" : "Expand"}
        </button>
        <button
        className=" top-2 right-2 border rounded-md p-1 bg-white hover:bg-gray-100 text-gray-600 text-xs"
        onClick={handleCopy}
        title="Copy code"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
      </div>

      <SyntaxHighlighter
        language={language}
        style={oneDark}
        showLineNumbers
        wrapLines={true}
        customStyle={{
          margin: 0,
          padding: "1rem",
          borderRadius: 0,
          maxHeight: expanded ? undefined : 300,
          overflowY: expanded ? undefined : "auto",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
