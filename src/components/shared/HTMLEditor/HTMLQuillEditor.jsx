import { useEffect } from "react";
import { useQuill } from "react-quilljs";
import 'quill/dist/quill.snow.css';

export default function HTMLQuillEditor({ setValue, name, contentState }) {
  const { quill, quillRef } = useQuill();

  useEffect(() => {
    if (!quill) return; // Wait until quill is ready

    // --- Load initial content ---
    if (contentState) {
      let initialHTML = "";
      try {
        const parsed = JSON.parse(contentState);
        initialHTML = parsed.html || "";
      } catch (e) {
        console.error(
          "JSON Parse error while reading HTML content:",
          name,
          e
        );
        initialHTML = contentState; // fallback to plain HTML string
      }

      // Instead of directly assigning innerHTML (which can break Quill formats),
      // use dangerouslyPasteHTML so Quill parses formats correctly:
      quill.clipboard.dangerouslyPasteHTML(initialHTML);
    }

    // --- Listen for text changes ---
    const handleChange = () => {
      const html = quill.root.innerHTML;
      const htmlObj = { html };
      // Save as JSON string
      setValue(name, JSON.stringify(htmlObj));
      console.log("JSON OUTPUT::::::", htmlObj);
    };

    quill.on("text-change", handleChange);

    // Cleanup listener on unmount to prevent memory leaks
    return () => {
      quill.off("text-change", handleChange);
    };
  }, [quill]);

  return (
    <div style={{ maxHeight: "350px", overflow: "auto" }}>
      <div style={{ width: 500, height: 250 }}>
        <div ref={quillRef} />
      </div>
    </div>
  );
}
