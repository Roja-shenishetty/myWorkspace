import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

<div
    key={file.id}
    className="relative w-full overflow-hidden border border-gray-300 rounded-lg bg-gray-50 text-sm group"
>
    <h6 className="w-fit flex items-center text-center rounded border border-gray-300 bg-gray-200 px-2.5 py-1 text-xs text-gray-800 mt-2 mb-1 ml-2">
        {file.language.toUpperCase()}
    </h6>
    <SyntaxHighlighter
        language={file.language}
        style={oneDark}
        customStyle={{
            margin: 0,
            padding: "1rem",
            borderRadius: "0.5rem",

            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
        }}
    >
        {file.content || ""}
    </SyntaxHighlighter>

    <button
        className="border rounded-md p-1 hover:bg-gray-300 transition absolute top-2 right-2 text-gray-500"
        title="Copy code"
        onClick={() => handleCopy(file.id, file.content)}
    >
        {copiedId === file.id ? "Copied!" : "Copy"}
    </button>
</div>