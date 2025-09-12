// src/MarkdownEditor.jsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactMarkdown, { defaultUrlTransform } from 'react-markdown';
import Split from 'react-split';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism'; // Or any other theme you prefer
import {
  Box,
  IconButton,
  Paper,
  Tooltip,
  Divider,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,

} from '@mui/material';
import TitleIcon from '@mui/icons-material/Title';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import LinkIcon from '@mui/icons-material/Link';
import ImageIcon from '@mui/icons-material/Image';
import CodeIcon from '@mui/icons-material/Code';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import SaveIcon from '@mui/icons-material/Save';
import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CodeMirror from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { keymap } from '@codemirror/view';
import { defaultKeymap } from '@codemirror/commands';
import { EditorSelection } from '@codemirror/state';
import './Split.css';
import { useDebouncedCallback } from 'use-debounce';

// For html2pdf.js, ensure it's installed via npm (npm install html2pdf.js)
// and then imported:
import html2pdf from 'html2pdf.js';
// Alternatively, if using a CDN, ensure the script tag is in your public/index.html:
// <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>


// Import remark-gfm for GitHub Flavored Markdown (e.g., tables)
import remarkGfm from 'remark-gfm';

export default function MarkdownEditor() {
  const [text, setText] = useState(() => {
    return localStorage.getItem('markdown-draft') || '# Welcome to the editor';
  });

   const urlTransform = (url) =>
    url.startsWith('data:') ? url : defaultUrlTransform(url);

  const slugify = (text) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')   // remove non-alphanumeric except _ and -
      .replace(/[\s_]+/g, '-')    // replace space/underscore with dash
      .replace(/^-+|-+$/g, '');   // trim leading/trailing hyphens


  const debouncedSave = useDebouncedCallback(latest => {
    localStorage.setItem('markdown-draft', latest);
  }, 500);

  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('markdown-favorites')) || [];
    } catch {
      return [];
    }
  });
  const [selectedFav, setSelectedFav] = useState('');

  const [headings, setHeadings] = useState([]);
  // editorRef.current will hold the CodeMirror EditorView instance
  const editorRef = useRef(null);
  const previewRef = useRef(null);
  const fileInputRef = useRef(null);

  const [isToolbarMinimized, setIsToolbarMinimized] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('markdown-draft');
    setText(saved ?? '# Welcome to the editor');
  }, []);

  useEffect(() => {
    debouncedSave(text);
    const hs = [];
    // Regex to find markdown headings and capture their position
    const regex = /^ *(#{1,6}) +(.+)/gm;
    let match;
    // Iterate through the text to find all headings
    while ((match = regex.exec(text))) {
      hs.push({
        level: match[1].length, // Number of '#' determines heading level
        text: match[2],         // The actual heading text
        slug: slugify(match[2]),// Slugified text for anchor links
        charPos: match.index    // Store the character position of the heading
      });
    }
    setHeadings(hs);
  }, [text, debouncedSave]);

  const handleFileChange = async e => {
    const file = e.target.files[0];
    if (!file) return;
    const content = await file.text();
    setText(content);
    const exists = favorites.some(f => f.name === file.name);
    if (!exists) {
      const newFavs = [...favorites, { name: file.name, content }];
      setFavorites(newFavs);
      localStorage.setItem('markdown-favorites', JSON.stringify(newFavs));
    }
    setSelectedFav(file.name);
    fileInputRef.current.value = null;
  };

  const handleFavSelect = e => {
    const name = e.target.value;
    setSelectedFav(name);
    const fav = favorites.find(f => f.name === name);
    if (fav) setText(fav.content);
  };

  const applyWrap = (before, after = before, prefixLine = false) => {
    const view = editorRef.current; // editorRef.current is the EditorView
    if (!view) {
      console.warn("CodeMirror EditorView not available. Cannot apply wrap.");
      return;
    }
    const { state, dispatch } = view;
    const { from, to } = state.selection.main;

    if (prefixLine) {
      const line = state.doc.lineAt(from);
      dispatch({
        changes: { from: line.from, to: line.from, insert: before },
        selection: EditorSelection.single(line.from + before.length + (from - line.from)),
      });
    } else {
      const selected = state.doc.sliceString(from, to);
      const insertText = before + selected + after;
      dispatch({
        changes: { from, to, insert: insertText },
        selection: EditorSelection.range(
          from + before.length,
          from + before.length + selected.length
        ),
      });
    }
    view.focus();
  };

  const insertLink = () => {
    const view = editorRef.current; // editorRef.current is the EditorView
    if (!view) {
      console.warn("CodeMirror EditorView not available. Cannot insert link.");
      return;
    }
    const { state, dispatch } = view;
    const { from, to } = state.selection.main;
    const sel = state.doc.sliceString(from, to) || 'link text';
    const url = window.prompt('Enter URL', 'https://');
    if (!url) return;
    const md = `[${sel}](${url})`;
    dispatch({
      changes: { from, to, insert: md },
      selection: EditorSelection.range(from + 1, from + 1 + sel.length),
    });
    view.focus();
  };

  const insertImageWithDimensions = () => {
    const view = editorRef.current; // editorRef.current is the EditorView
    if (!view) {
      console.warn("CodeMirror EditorView not available. Cannot insert image.");
      return;
    }

    const imageUrl = window.prompt('Enter image URL:', 'https://example.com/image.jpg');
    if (!imageUrl) return;

    const altText = window.prompt('Enter alt text for the image:', 'My Image');
    // Alt text can be empty, so no return if null/empty

    const width = window.prompt('Enter image width (e.g., 300 or 50%):', '');
    const height = window.prompt('Enter image height (optional, e.g., 200):', '');

    let imgHtml = `<img src="${imageUrl}" alt="${altText || ''}"`;

    if (width) {
      imgHtml += ` width="${width}"`;
    }
    if (height) {
      imgHtml += ` height="${height}"`;
    }
    imgHtml += `>`;

    const { state, dispatch } = view;
    const pos = state.selection.main.head;
    dispatch({
      changes: { from: pos, to: pos, insert: imgHtml },
      selection: EditorSelection.single(pos + imgHtml.length),
    });
    view.focus();
  };

  const insertBase64Image = async () => {
    const view = editorRef.current;
    if (!view) {
      console.warn("CodeMirror EditorView not available. Cannot insert Base64 image.");
      return;
    }
        let base64Data = '';
    let altText = '';
    let imageFound = false;

    try {
      // Attempt to read image data from clipboard
      const clipboardItems = await navigator.clipboard.read();
      for (const item of clipboardItems) {
        if (item.types.includes('image/png')) {
          const blob = await item.getType('image/png');
          const reader = new FileReader();
          reader.onload = (event) => {
            base64Data = event.target.result;
            altText = 'Pasted Image'; // Default alt text for clipboard images
            imageFound = true;
            insertImageIntoEditor(base64Data, altText);
          };
          reader.onerror = (error) => {
            console.error("Error reading image blob as Base64:", error);
            alert("Failed to read image from clipboard.");
          };
          reader.readAsDataURL(blob);
          return; // Exit after finding the first image
        }
        // You can add more image types here if needed, e.g., 'image/jpeg'
      }
    } catch (err) {
      console.warn('Failed to read image from clipboard programmatically:', err);
      // Fallback to text clipboard read if image read fails
    }

    // If no image found on clipboard, or if clipboard.read() is not supported/fails,
    // then prompt for manual Base64 string.
    if (!imageFound) {
      let clipboardTextContent = '';
      try {
        clipboardTextContent = await navigator.clipboard.readText();
        if (!clipboardTextContent.startsWith('data:image/')) {
          clipboardTextContent = '';
        }
      } catch (err) {
        console.warn('Failed to read text from clipboard programmatically:', err);
        clipboardTextContent = '';
      }

    const base64Data = window.prompt('--No image data found on clipboard (e.g., data:image/png;base64,...):',
    clipboardTextContent || 'data:image/png;base64,');
    if (!base64Data) return;

      altText = window.prompt('Enter alt text for the image (optional):', '');
      insertImageIntoEditor(base64Data, altText);
    }
  };

  const insertImageIntoEditor = (base64Data, altText) => {
    const view = editorRef.current;
    if (!view) {
      console.warn("CodeMirror EditorView not available. Cannot insert image.");
      return;
    }
    const width = window.prompt('Enter image width (e.g., 300 or 50%, optional):', '');
    const height = window.prompt('Enter image height (optional, e.g., 200, optional):', '');

    let imgHtml = `<img src="${base64Data}" alt="${altText || ''}"`;

    if (width) {
      imgHtml += ` width="${width}"`;
    }
    if (height) {
      imgHtml += ` height="${height}"`;
    }
    imgHtml += `>`;

    const { state, dispatch } = view;
    const pos = state.selection.main.head;
    dispatch({
      changes: { from: pos, to: pos, insert: imgHtml },
      selection: EditorSelection.single(pos + imgHtml.length),
    });
    view.focus();
  };

  const uploadAndInsert = async file => {
    if (!file.type.startsWith('image/')) return;
    const defaultAlt = file.name.replace(/\.[^/.]+$/, '');
    const alt = window.prompt('Alt text for image', defaultAlt) || defaultAlt;
    const fd = new FormData();
    fd.append('image', file, alt + file.name);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      if (!res.ok) throw new Error(await res.text());
      const { url } = await res.json();
      const view = editorRef.current; // editorRef.current is the EditorView
      if (!view) {
        console.warn("CodeMirror EditorView not available. Cannot upload and insert image.");
        return;
      }
      const { state, dispatch } = view;
      const pos = state.selection.main.head;
      const md = `![${alt}](${url})`;
      dispatch({
        changes: { from: pos, to: pos, insert: md },
        selection: EditorSelection.single(pos + md.length),
      });
      view.focus();
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Image upload failed: ' + err.message);
    }
  };

  const handleDrop = e => {
    e.preventDefault();
    Array.from(e.dataTransfer.files).forEach(uploadAndInsert);
  };
  const handleDragOver = e => e.preventDefault();
  const handlePaste = e => {
    const items = Array.from(e.clipboardData?.items || []);
    const imgItems = items.filter(
      i => i.kind === 'file' && i.type.startsWith('image/')
    );
    if (!imgItems.length) return;
    e.preventDefault();
    imgItems.forEach(item => {
      const file = item.getAsFile();
      if (file) uploadAndInsert(file);
    });
  };

  const exportMarkdown = () => {
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportHtml = () => {
    const html = `<!DOCTYPE html><html><head><title>Markdown Document</title></head><body>${previewRef.current.innerHTML}</body></html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPdf = () => {
    if (!previewRef.current) {
      console.error("Preview element not found for PDF export.");
      alert("Preview content not available for PDF export.");
      return;
    }

    // Create a temporary container to hold all content for PDF
    const pdfContentWrapper = document.createElement('div');
    // Apply styles to ensure it takes full A4 width (210mm total width)
    // The margin will be applied by html2pdf.js options.
    pdfContentWrapper.style.width = '210mm'; // Full A4 width
    pdfContentWrapper.style.boxSizing = 'border-box';
    pdfContentWrapper.style.padding = '0';
    pdfContentWrapper.style.margin = '0';
    pdfContentWrapper.style.fontFamily = 'Inter, sans-serif';

    // 1. Create and add the Outline page
    let outlineHtml = '';
    if (headings.length > 0) {
      outlineHtml += `
        <div style="width: 190mm; margin: 10mm; box-sizing: border-box; font-family: Inter, sans-serif;">
          <h1 style="font-size: 36px; font-weight: bold; margin-bottom: 20px;">Table of Contents</h1>
          <ul style="list-style: none; padding-left: 0;">
      `;
      headings.forEach(h => {
        // Create actual anchor tags for links in PDF.
        // The display: block is important for the clickable area.
        outlineHtml += `
          <li style="margin-bottom: 8px; margin-left: ${(h.level - 1) * 20}px;">
            <span style="
              text-decoration: none;
              color: #1976d2; /* Standard link blue */
              font-size: ${20 - (h.level * 2)}px; /* Adjust font size based on level */
              font-weight: normal;
              display: block; /* Make the whole list item clickable */
              padding: 2px 0;
              font-family: inherit;
            ">
              ${h.text}
            </span>
          </li>
        `;
      });
      outlineHtml += `
          </ul>
        </div>
       <!-- <div class="html2pdf__page-break" style="min-height: 1px; page-break-before: always !important;"></div> -->
        <!-- Page break after outline -->
      `;
    } else {
      outlineHtml += `
        <div style="width: 190mm; margin: 10mm; box-sizing: border-box; font-family: Inter, sans-serif;">
          <p style="font-size: 16px; margin-bottom: 20px;">No headings found to generate a Table of Contents.</p>
        </div>
         <div class="html2pdf__page-break" style="min-height: 1px; page-break-before: always !important;"></div> <!-- Page break even if no TOC -->
      `;
    }
    pdfContentWrapper.innerHTML += outlineHtml;

    // 2. Add Main Markdown Preview content
    // Clone the preview content to avoid modifying the live DOM directly
    const clonedPreviewContent = previewRef.current.cloneNode(true);
    // Ensure cloned content doesn't have conflicting styles for PDF rendering
    clonedPreviewContent.style.overflow = 'visible';
    clonedPreviewContent.style.height = 'auto';
    clonedPreviewContent.style.width = '100%'; // Ensure content takes 100% of the temp container
    clonedPreviewContent.style.maxWidth = '100%';
    clonedPreviewContent.style.boxSizing = 'border-box';
    // *** IMPORTANT FIX: Ensure no top margin pushes content down on new page ***
    clonedPreviewContent.style.marginTop = '0 !important'; // Corrected to 0
    // The original padding of previewRef.current (p: 2) is ~16px. We'll let html2pdf margin handle this
    // by setting the tempPdfContainer to 210mm and then the internal content will respect the 10mm margin.
    clonedPreviewContent.style.padding = '0'; // Remove explicit padding from cloned content

    pdfContentWrapper.appendChild(clonedPreviewContent);

    // Temporarily append the wrapper to the document body for html2pdf to process
    document.body.appendChild(pdfContentWrapper);

    const options = {
      margin: 10, // This is 10mm margin on the final PDF page (top, right, bottom, left)
      filename: 'document.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2, // Higher scale for better resolution
        useCORS: true, // Important for images from other domains
        // Set width to the actual rendered width of the temp container for accurate capture
        width: pdfContentWrapper.offsetWidth, // Use the actual rendered width of the wrapper
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
      },
      // Page-break options for html2pdf.js
      pagebreak: {
        mode: ['css', 'legacy'] // Respect CSS page-break properties and html2pdf__page-break class
      }
    };

    // Use the imported html2pdf module directly
    if (html2pdf) { // Check if the module is imported and available
      html2pdf().set(options).from(pdfContentWrapper).save().then(() => {
        document.body.removeChild(pdfContentWrapper);
      }).catch(error => {
        console.error("Error generating PDF:", error);
        alert("Failed to generate PDF. Please try again.");
        document.body.removeChild(pdfContentWrapper);
      });
    } else {
      console.error("html2pdf.js library not found. Please ensure it's loaded (e.g., via npm install html2pdf.js and import, or CDN).");
      alert("PDF export library not loaded. Please try again or check console for errors.");
      document.body.removeChild(pdfContentWrapper);
    }
  };

  // Custom Heading Renderer to create internal links in PDF and apply styles
  const HeadingRenderer = level => ({ node, ...props }) => {
    const text = node.children
      .filter(c => c.type === 'text')
      .map(c => c.value)
      .join('');
    const slug = slugify(text);

    const headingStyles = {
      fontFamily: 'Inter, sans-serif',
      fontWeight: 'bold',
      marginBottom: '10px', // Default margin bottom
    };

    // Apply specific styles based on heading level
    switch (level) {
      case 1:
        headingStyles.fontSize = '32px';
        headingStyles.marginTop = '20px'; // Add some top margin for H1
        break;
      case 2:
        headingStyles.fontSize = '28px';
        headingStyles.marginTop = '18px';
        break;
      case 3:
        headingStyles.fontSize = '24px';
        headingStyles.marginTop = '16px';
        break;
      case 4:
        headingStyles.fontSize = '20px';
        headingStyles.marginTop = '14px';
        break;
      case 5:
        headingStyles.fontSize = '18px';
        headingStyles.marginTop = '12px';
        break;
      case 6:
        headingStyles.fontSize = '16px';
        headingStyles.marginTop = '10px';
        break;
      default:
        headingStyles.fontSize = '20px'; // Fallback
    }


    const HeadingTag = `h${level}`;
    return React.createElement(HeadingTag, { id: slug, style: headingStyles }, // Apply styles here
      // Wrap the children (heading text) in an anchor tag for internal PDF linking
      React.createElement('a', {
        href: `#${slug}`,
        // These styles are crucial to make the link invisible but functional in PDF
        style: {
          textDecoration: 'none', // Remove underline
          color: 'inherit',        // Inherit text color
          cursor: 'pointer',       // Indicate it's clickable (for browser preview)
          fontFamily: 'inherit',   // Inherit font family
          // Ensure the link takes up the full width/height of the heading text
          display: 'inline-block', // Or 'block' if you want the whole line clickable
          width: '100%',
          height: '100%',
        },
      }, props.children)
    );
  };

  // Debounced function to sync scroll position from editor to preview
  const syncEditorToPreviewScroll = useCallback(useDebouncedCallback(() => {
    const editorView = editorRef.current;
    const previewElement = previewRef.current;

    if (!editorView || !previewElement) {
      return;
    }

    const editorScrollTop = editorView.scrollDOM.scrollTop;

    // If the editor is at or very near the top, scroll the preview to its top
    if (editorScrollTop < 50) { // Using a small threshold (e.g., 50px)
      previewElement.scrollTop = 0;
      return; // Exit early as we've handled the top-of-document case
    }

    let activeHeadingSlug = null;
    let closestHeadingDistance = Infinity;

    for (let i = headings.length - 1; i >= 0; i--) {
      const heading = headings[i];
      const headingCoords = editorView.coordsAtPos(heading.charPos);

      if (headingCoords) {
        const distance = Math.abs(headingCoords.top - editorScrollTop);

        if (headingCoords.top <= editorScrollTop + 20 && distance < closestHeadingDistance) {
          activeHeadingSlug = heading.slug;
          closestHeadingDistance = distance;
        }
      }
    }

    if (activeHeadingSlug) {
      const targetElement = previewElement.querySelector(`#${CSS.escape(activeHeadingSlug)}`);
      if (targetElement) {
        const previewRect = previewElement.getBoundingClientRect();
        const targetRect = targetElement.getBoundingClientRect();

        if (targetRect.top < previewRect.top || targetRect.bottom > previewRect.bottom) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
  }, 100), [headings]); // headings as dependency for useCallback to ensure it's up-to-date

  // Effect to attach scroll listener to CodeMirror's scrollDOM
  useEffect(() => {
    const editorView = editorRef.current;
    if (editorView) {
      const handleEditorScroll = () => {
        syncEditorToPreviewScroll();
      };
      editorView.scrollDOM.addEventListener('scroll', handleEditorScroll);
      return () => {
        editorView.scrollDOM.removeEventListener('scroll', handleEditorScroll);
      };
    }
  }, [syncEditorToPreviewScroll]);

  // Also trigger sync when text changes (e.g., typing, loading new file)
  useEffect(() => {
    syncEditorToPreviewScroll();
  }, [text, syncEditorToPreviewScroll]);


  return (
    <Box sx={{ height: '90vh', maxWidth:1920,  display: 'flex', flexDirection: 'column' }}>
      {/* Toolbar Container */}
      <Box sx={{
        position: "sticky",
        zIndex: 1000,
        backgroundColor: 'background.paper',
        boxShadow: 2,
        p: 1,
        flexShrink: 0,
      }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
          <Tooltip title="Open File">
            <IconButton onClick={() => fileInputRef.current.click()}>
              <FolderOpenIcon />
            </IconButton>
          </Tooltip>
          <input
            type="file"
            accept=".md"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="fav-label">Favorites</InputLabel>
            <Select
              labelId="fav-label"
              value={selectedFav}
              label="Favorites"
              onChange={handleFavSelect}
            >
              {favorites.map(f => (
                <MenuItem key={f.name} value={f.name}>{f.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
          <Tooltip title="Heading">
            <IconButton onClick={() => applyWrap('# ', '', true)}>
              <TitleIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Bold">
            <IconButton onClick={() => applyWrap('**')}>
              <FormatBoldIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Italic">
            <IconButton onClick={() => applyWrap('*')}>
              <FormatItalicIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Quote">
            <IconButton onClick={() => applyWrap('> ', '', true)}>
              <FormatQuoteIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Code (inline)">
            <IconButton onClick={() => applyWrap('`')}>
              <CodeIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Code Block">
            <IconButton onClick={() => applyWrap('```\n', '\n```\n')}>
              <CodeIcon />
            </IconButton>
          </Tooltip>
          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
          <Tooltip title="Link">
            <IconButton onClick={insertLink}>
              <LinkIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Insert Image (from URL)">
            <IconButton onClick={insertImageWithDimensions}>
              <ImageIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Insert Base64 Image (from Clipboard or Manual)">
            <IconButton onClick={insertBase64Image}>
              <ImageIcon /> {/* Using ImageIcon, but you might consider a custom SVG for distinction */}
            </IconButton>
          </Tooltip>

          <Box sx={{ flex: 1 }} />

          <Tooltip title="Export Markdown (.md)">
            <IconButton onClick={exportMarkdown}>
              <SaveIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Export HTML (.html)">
            <IconButton onClick={exportHtml}>
              <DownloadIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Export PDF (.pdf)">
            <IconButton onClick={exportPdf}>
              <PictureAsPdfIcon />
            </IconButton>
          </Tooltip>
        </Box>

      </Box>

      {/* Scrollable container for the Split layout */}
      <Box sx={{ flex: 1, overflowY: 'auto', position: 'sticky' }}>
        {/* Main Split Layout: Outline / Editor / Preview */}
        <Split sizes={[15, 42.5, 42.5]} minSize={100} gutterSize={8} style={{ display: 'flex', height: '100%' }}>
          {/* Outline */}
          <Box sx={{
            p: 1,
            overflowY: 'scroll',
            borderRight: theme => `1px solid ${theme.palette.divider}`,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
            height: '100%',
          }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold', flexShrink: 0 }}>Outline</Typography>
            {headings.length === 0 && <Typography variant="body2" color="text.secondary">No headings found.</Typography>}
            {headings.map(h => (
              <Typography
                key={h.slug}
                variant="body2"
                sx={{
                  pl: (h.level - 1) * 2,
                  cursor: 'pointer',
                  '&:hover': { textDecoration: 'underline', color: 'primary.main' },
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  flexShrink: 0,
                }}
                onClick={() => {
                  // Scroll preview to the element
                  const previewEl = previewRef.current?.querySelector(`#${CSS.escape(h.slug)}`);
                  previewEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });

                  // Scroll editor to the corresponding character position using a transaction
                  const editorView = editorRef.current;
                  if (editorView) {
                    editorView.dispatch({
                      selection: EditorSelection.cursor(h.charPos), // Set cursor to the heading's position
                      scrollIntoView: true // This property tells CodeMirror to scroll the selection into view
                    });
                    editorView.focus(); // Keep focus on the editor
                  }
                }}

              >
                {h.text}
              </Typography>
            ))}
          </Box>

          {/* Editor */}
          <Box
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onPaste={handlePaste}
            sx={{ display: 'flex', flexDirection: 'column', borderRight: theme => `1px solid ${theme.palette.divider}`, height: '100%' }}
          >
            <CodeMirror
              value={text}
              height="100%"
              maxHeight='80vh'
              extensions={[
                markdown(),
                keymap.of(defaultKeymap)
              ]}
              onChange={setText}
              onCreateEditor={(view) => { // Corrected: onCreateEditor provides the EditorView directly
                editorRef.current = view;
              }}
              theme="dark"
              basicSetup={{
                lineNumbers: true,
                highlightActiveLineGutter: true,
                highlightActiveLine: true,
                foldGutter: true,
                drawSelection: true,
                dropCursor: true,
                allowMultipleSelections: true,
                indentOnInput: true,
                syntaxHighlighting: true,
                tabSize: 2,
              }}
            />
          </Box>

          {/* Preview */}
          <Paper ref={previewRef} variant="outlined" sx={{
            p: 2,
            flex: 1,
            overflowY: 'auto',
            backgroundColor: theme => (theme.palette.mode === 'dark' ? '#1e1e1e' : '#fafafa'),
            border: 'none',
          }}>
            {/* Styles for tables */}
            <style>
              {`
              table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 1em;
              }
              th, td {
                border: 1px solid #ccc;
                padding: 8px;
                text-align: left;
              }
              th {
                background-color: #f2f2f2;
                font-weight: bold;
              }
              /* Dark mode adjustments */
              .MuiPaper-root.MuiPaper-outlined[style*="background-color: rgb(30, 30, 30)"] table,
              .MuiPaper-root.MuiPaper-outlined[style*="background-color: rgb(30, 30, 30)"] th,
              .MuiPaper-root.MuiPaper-outlined[style*="background-color: rgb(30, 30, 30)"] td {
                border-color: #555; /* Lighter border for dark mode */
              }
              .MuiPaper-root.MuiPaper-outlined[style*="background-color: rgb(30, 30, 30)"] th {
                background-color: #333; /* Darker background for dark mode headers */
              }
              .MuiPaper-root.MuiPaper-outlined[style*="background-color: rgb(30, 30, 30)"] th,
              .MuiPaper-root.MuiPaper-outlined[style*="background-color: rgb(30, 30, 30)"] td {
                color: #eee; /* Light text for dark mode */
              }
              `}
            </style>
            <ReactMarkdown
            urlTransform={urlTransform}
              rehypePlugins={[rehypeRaw]}
              remarkPlugins={[remarkGfm]} // Add remarkGfm for table support
              components={{
                h1: HeadingRenderer(1),
                h2: HeadingRenderer(2),
                h3: HeadingRenderer(3),
                h4: HeadingRenderer(4),
                h5: HeadingRenderer(5),
                h6: HeadingRenderer(6),

                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={dracula}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {text}
            </ReactMarkdown>
          </Paper>
        </Split>
      </Box>
    </Box>
  );
}
