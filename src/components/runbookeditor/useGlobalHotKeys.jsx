import React, { useEffect, useRef } from "react";

export default function useGlobalHotkeys({onPreview, onEdit, onNewSection, sectionRefs}) {
  useEffect(() => {
    const handler = (e) => {
      // Ctrl + P
      if (e.ctrlKey && e.key.toLowerCase() === "p") {
        e.preventDefault();
        onPreview && onPreview();
      }
      // Ctrl + E
      if (e.ctrlKey && e.key.toLowerCase() === "e") {
        e.preventDefault();
        onEdit && onEdit();
      }
      // Ctrl + l
      if (e.ctrlKey && e.key.toLowerCase() === "l") {
        e.preventDefault();
        onNewSection && onNewSection();
      }
     // console.log("Section refs??",sectionRefs)
      // Tab/Shift+Tab for section focus
      if (e.ctrlKey && e.key.toLowerCase() === "m" && sectionRefs.length > 0) {
        e.preventDefault();
        // Find the currently focused section
        console.log(sectionRefs, "sectionsRefs")
        const active = document.activeElement;
        let idx = sectionRefs.findIndex(ref => ref.current === active);
        if (e.shiftKey) {
          // previous
          idx = idx > 0 ? idx - 1 : sectionRefs.length - 1;
        } else {
          // next
          idx = idx < sectionRefs.length - 1 ? idx + 1 : 0;
        }
        sectionRefs[idx].current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onPreview, onEdit, onNewSection, sectionRefs]);
}
