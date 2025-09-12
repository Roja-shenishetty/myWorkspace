import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import MarkdownPreview from '@uiw/react-markdown-preview';
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import './markdown.css'

const MarkdownViewer = ({ content, params }) => {
  return (
    <>
      <MarkdownPreview
       rehypePlugins={[rehypeHighlight]}
       remarkPlugins={[remarkGfm]}
        source={content}
        style={{          
          maxWidth: 800,
          marginTop:5,
          lineHeight: 1.2,
          background: "#fff",
          ...params
        }}></MarkdownPreview>
    </>
  );
};

export default MarkdownViewer;
