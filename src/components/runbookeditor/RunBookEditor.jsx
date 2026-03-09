import React, { useState, useRef, useEffect } from "react";
import {
    Container,
    Box,
    Fab
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import Editor from "@monaco-editor/react";
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import useGlobalHotkeys from './useGlobalHotKeys'

import StyledPreviewTimeline from './StyledPreviewTimeline'
import SaveIcon from '@mui/icons-material/Save';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';

import FileAppBar from "../shared/FileAppBar/FileAppBar";
import FavouritesPopup from "../shared/FavouritesTree/FavouritesPopup";
import EditorTimeLine from "./EditorTimeLine";
import { v4 as uuidv4 } from "uuid";
import YouTubeUploader from "../shared/YouTubeUploader/YouTubeUploader";
import ScreenRecorder from "../shared/ScreenRecorder/ScreenRecorder";
import ScreenRecorderFab from "../shared/ScreenRecorder/ScreenRecorderFab";
import YouTubeUploaderFab from "../shared/YouTubeUploader/YouTubeUploaderFab";
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import ClearLocalStorageWithConfirm from "./ClearLocalStorageWithConfirm";
import RecentFilesPopup from "./RecentFilesPopup";
import ScreenCameraRecorderFab from "../shared/CameraRecorder/ScreenCameraRecorderFab";
import { Fade } from "@mui/material";


// Your default favourites file, e.g., a raw link from a GitHub repo
const defaultFavouritesUrl = "https://raw.githubusercontent.com/venkatparsi/ilearn-course-sweng-js-ts-react-python-django/refs/heads/master/course/table-of-contents.json";


const description = `
Create 
 A new [react](url) app project in your local system. 

> Note:. <br/>  1) Need  to install [Nodejs ](url)
  first <br/> 2) VSCode IDE for development

\`\`\`
Sample Code Block
\`\`\`
<!-- Comment -->
[Sample Link](url)
> 
\`Code\` is used like this.
<p> This is a paragraph</p>
`


const initialSections = [
    {
        id: uuidv4(),
        order: 1,
        title: "Introduction",
        description: description,
        codeFiles: [],
        //     {
        //         id: uuidv4(),
        //         order: 1,
        //         filename: "main.py",
        //         language: "python",
        //         content: "print('Hello World')",
        //     },
        // ],
        mediaFiles: [
            // {
            //     id: uuidv4(),
            //     order: 1,
            //     description: "Sample Image",
            //     url: "https://placehold.co/400x200",
            // },
        ],
    },
];


//dummy data.. 
// {
//   "metadata": {
//     "fileId": "some-unique-file-id",
//     "topicName": "Introduction to Koila Koil Dance",
//     "topicDescription": "This topic covers the basics and history of Koila Koil dance.",
//     "tags": ["dance", "koila koil", "culture"],
//     "parentId": "parent-topic-id",
//     "parentType": "course"  // e.g., course, module, unit
//   },
//   "sections": [
//     {
//       "id": "8a1553bc-1ea3-476a-a521-aff743b57ec6",
//       "order": 1,
//       "title": "Koila Koil Dance",
//       "description": "",
//       "codeFiles": [ /* code files */ ],
//       "mediaFiles": [ /* media files */ ],
//       "timeToRead": 8,
//       "timeToRun": 8,
//       "teachingPlan": {
//         "prerequisites": "Warmup activity details here...",
//         "assessment": "Question & answers here...",
//         "pedagogy": "Instructions and special notes here...",
//         "evaluation": "Evaluation criteria or notes here..."
//       }
//     }   
//   ],
//   "periodPlan": {
//     "prerequisites": "Common warmup activities for entire period",
//     "assessment": "Overall assessment strategy",
//     "pedagogy": "General instructions and pedagogy notes",
//     "evaluation": "Evaluation methods for the period"
//   }
// }


// Dummy initial data
const initialSections2 = [
    {
        id: "section1",
        order: 1,
        title: "Section 1",
        timeToRead: 5,
        timeToRun: 3,
        description: "Description for section 1",
        codeFiles: [
            { id: "code1", order: 1, filename: "file1.js", language: "javascript", content: "// code 1" },
            { id: "code2", order: 2, filename: "file2.py", language: "python", content: "# code 2" },
        ],
        mediaFiles: [
            { id: "media1", order: 1, url: "https://placekitten.com/200/300", description: "Kitten", mediaDescription: "Cute kitten", mediaWidth: 200, mediaHeight: 300 },
            { id: "media2", order: 2, url: "https://placebear.com/200/300", description: "Bear", mediaDescription: "Big bear", mediaWidth: 200, mediaHeight: 300 },
        ],
    },
    {
        id: "section2",
        order: 2,
        title: "Section 2",
        timeToRead: 4,
        timeToRun: 2,
        description: "Description for section 2",
        codeFiles: [
            { id: "code3", order: 1, filename: "file3.html", language: "html", content: "<!-- html file -->" },
        ],
        mediaFiles: [],
    },
];

const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
};
const handleScrollBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
};


const getInitialSections = () => {
    const saved = localStorage.getItem("runbookSections");
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch { console.log("Error reading initial Sections") }
    }
    return initialSections;
};

const RECENT_FILES_KEY = "recentEditedFiles";

const loadRecentFiles = () => {
    try {
        const saved = localStorage.getItem(RECENT_FILES_KEY);
        if (saved) return JSON.parse(saved);
    } catch { }
    return [];
};
const scrollFabStyle = {
  position: "fixed",
  left: { xs: 12, sm: 32 },
  width: { xs: 38, sm: 56 },
  height: { xs: 38, sm: 56 },
  minHeight: { xs: 38, sm: 56 },
  display: "flex",
  zIndex: 9999
};


export default function RunBookEditor() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [sections, setSections] = useState(getInitialSections);
    const [recentFiles, setRecentFiles] = useState(loadRecentFiles);
    const [tab, setTab] = useState(0);
    const sectionRefs = useRef([]);
    const [menuOpen,setMenuOpen]=useState(false);
    const [currentFileName, setCurrentFileName] = useState("runbook.json");
    // Example in Parent Component
    const [hideUI, setHideUI] = useState(false);
    const [selectedTabs, setSelectedTabs] = useState({
        code: {},  // sectionId -> selected code tab index
        media: {}  // sectionId -> selected media tab index
    });


    const handleClearLocal = () => {
        localStorage.removeItem("runbookSections");
        setSections(initialSections);
    };


    const fileInputRef = useRef(null);

    const handleSaveFile = () => {
          console.log("Save clicked");
        addToRecentFiles({
            id: currentFileName, // or a unique id for your files
            fileName: currentFileName,
            url: "", // If you have a URL, else blank or "#"
            editedAt: new Date().toISOString(),
        });
        handleSaveSectionsJSON(sections, currentFileName)
    }

    const handleOpenFile = () => {
        if (fileInputRef.current) fileInputRef.current.click();
    };

    const handleLoadSectionsJSON = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        setCurrentFileName(file.name);

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedSections = JSON.parse(e.target.result);
                // Validate structure if needed before setting state!
                setSections(importedSections);
                // Try guessing and loading metadata based on main file name
                tryLoadMetadata(file.name);

                addToRecentFiles({
                    id: file.name,
                    fileName: file.name,
                    url: "", // Or file URL if available
                    editedAt: new Date().toISOString(),
                });
            } catch (error) {
                alert("Invalid JSON file.");
            }
        };
        reader.readAsText(file);
    };



    const tryLoadMetadata = async (filename) => {
        // Replace .json with .metadata.json
        const metaName = filename.replace(/(\.json)$/i, '.metadata.json');
        // Prompt the user to pick a file for metadata, or (if possible) auto-search in file list
        // For a friendly UX, ask the user to pick the metadata file if not auto-loaded


        // Prompt the user to select a directory
        const dirHandle = await window.showDirectoryPicker();
        for await (const entry of dirHandle.values()) {
            if (entry.kind === 'file' && entry.name.endsWith('.metadata.json')) {
                const file = await entry.getFile();
                // read file content here
            }
            else {
                console.log("entry..", entry)
                alert("Metadata file not found or the name doesn't match.");
                //         return;
            }
        }
        
        // const input = document.createElement('input');
        // input.type = 'file';
        // input.accept = 'application/json';
        // input.style.display = 'none';
        // input.onchange = (e) => {
        //     const metaFile = e.target.files[0];
        //     if (!metaFile || metaFile.name !== metaName) {
        //         alert("Metadata file not found or the name doesn't match.");
        //         return;
        //     }
        //     const reader = new FileReader();
        //     reader.onload = (evt) => {
        //         try {
        //             setMetadata(JSON.parse(evt.target.result));
        //         } catch {
        //             alert("Invalid metadata file.");
        //         }
        //     };
        //     reader.readAsText(metaFile);
        // };
        // document.body.appendChild(input);
        // input.click();
        // document.body.removeChild(input);
    };


    const handleSaveSectionsJSON = (sections, filename = "sections.json") => {
        // Proper escaping: Use JSON.stringify with indentation for readability
        const json = JSON.stringify(sections, null, 2);

        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };


    const handleAddSection = () => {
        setSections((prev) => [
            ...prev,
            {
                id: uuidv4(),
                order: prev.length + 1,
                title: `Section ${prev.length + 1}`,
                description: description,
                codeFiles: [
                    {
                        id: uuidv4(),
                        order: 1,
                        filename: "index.txt",
                        language: "text",
                        content: "",
                    },
                ],
                mediaFiles: [],
            },
        ]);
    };


    const handleShowPreview = () => {
        setTab(1);
    }

    const handleShowEdit = () => {
        console.log("InEditMode");
        setTab(0);
    }


    // Place this function inside the RunbookEditor component, near the other handle... functions.
    const handleFavouriteSelect = async (selectedNode) => {

        console.log("Selected node", selectedNode?.url)

        if (!selectedNode || !selectedNode.url) return;
        const { url: fileUrl, name: fileName } = selectedNode;
        if (!fileUrl) return;

        try {
            const response = await fetch(fileUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();

            // Update the editor's content and the current file name
            setSections(data);
            setCurrentFileName(fileName || 'favourite-file.json');

            // For a better user experience, switch back to the editor tab
            setTab(0);

            // Scroll to the top to see the newly loaded content
            handleScrollTop();

        } catch (error) {
            console.error("Failed to load favourite runbook:", error);
            alert("Could not load the selected file. It might be an invalid JSON or the URL is incorrect.");
        }
    };


    useGlobalHotkeys({
        onPreview: handleShowPreview,
        onEdit: handleShowEdit,
        onNewSection: handleAddSection,
        sectionRefs,
    });


    // inside RunbookEditor:
    useEffect(() => {
        // Only save if sections is not empty, or adjust to your needs
        if (sections && Array.isArray(sections)) {
            localStorage.setItem("runbookSections", JSON.stringify(sections));
        }
    }, [sections]);


    // Handler to update any field inside sections, codeFiles, or mediaFiles
    const handleChange = (sectionId, type, id, value) => {
        setSections((prevSections) =>
            prevSections.map((section) => {
                if (section.id !== sectionId) return section;

                if (type === "title" || type === "description" || type === "timeToRead" || type === "timeToRun") {
                    return { ...section, [type]: value };
                }

                if (type === "codeFiles" && id) {
                    const newCodeFiles = section.codeFiles.map((cf) => (cf.id === id ? { ...cf, ...value } : cf));
                    return { ...section, codeFiles: newCodeFiles };
                }

                if (type === "mediaFiles" && id) {
                    const newMediaFiles = section.mediaFiles.map((mf) => (mf.id === id ? { ...mf, ...value } : mf));
                    return { ...section, mediaFiles: newMediaFiles };
                }

                return section;
            })
        );
    };

    // Handler to delete either a whole section, or code/media file inside a section
    // If only sectionId is passed, delete whole section
    const handleDelete = (sectionId, type = null, id = null) => {
        if (!type) {
            // Delete whole section
            setSections((prev) => prev.filter((s) => s.id !== sectionId));
        } else {
            // Delete codeFile or mediaFile in a section
            setSections((prev) =>
                prev.map((section) => {
                    if (section.id !== sectionId) return section;

                    if (type === "codeFiles") {
                        const filteredCodeFiles = section.codeFiles.filter((f) => f.id !== id);
                        // Reorder orders
                        filteredCodeFiles.forEach((f, i) => (f.order = i + 1));
                        return { ...section, codeFiles: filteredCodeFiles };
                    }

                    if (type === "mediaFiles") {
                        const filteredMediaFiles = section.mediaFiles.filter((f) => f.id !== id);
                        // Reorder orders
                        filteredMediaFiles.forEach((f, i) => (f.order = i + 1));
                        return { ...section, mediaFiles: filteredMediaFiles };
                    }

                    return section;
                })
            );
        }
    };

    const handleCloneSection = (sectionId) => {
        const sectionToCopy = sections.find((s) => s.id === sectionId);
        if (!sectionToCopy) return;

        // Deep clone to avoid references
        const copiedSection = JSON.parse(JSON.stringify(sectionToCopy));

        // Optional: generate new id if you want the copy to have a new identity immediately
        // copiedSection.id = uuidv4();

        localStorage.setItem("copiedSection", JSON.stringify(copiedSection));

        alert(`Section "${sectionToCopy.title}" copied! You can now paste it in another window.`);
    };

    const handlePasteSection = (targetSectionId = null) => {
        try {
            const copied = localStorage.getItem("copiedSection");
            if (!copied) {
                alert("No copied section found.");
                return;
            }
            const sectionToPaste = JSON.parse(copied);

            // Generate new IDs for copy and nested items
            sectionToPaste.id = uuidv4();
            if (sectionToPaste.codeFiles) {
                sectionToPaste.codeFiles = sectionToPaste.codeFiles.map((f) => ({ ...f, id: uuidv4() }));
            }
            if (sectionToPaste.mediaFiles) {
                sectionToPaste.mediaFiles = sectionToPaste.mediaFiles.map((m) => ({ ...m, id: uuidv4() }));
            }

            setSections((prev) => {
                if (!targetSectionId) {
                    // If no target, append at end
                    const result = [...prev, sectionToPaste];
                    return result.map((section, i) => ({ ...section, order: i + 1 }));
                }

                const index = prev.findIndex((s) => s.id === targetSectionId);
                if (index === -1) {
                    // Target not found, append at end
                    const result = [...prev, sectionToPaste];
                    return result.map((section, i) => ({ ...section, order: i + 1 }));
                }

                // Insert pasted section right after target index
                const result = [
                    ...prev.slice(0, index + 1),
                    sectionToPaste,
                    ...prev.slice(index + 1),
                ];

                // Recalculate orders properly
                return result.map((section, i) => ({ ...section, order: i + 1 }));
            });
        } catch (e) {
            alert("Failed to paste section.");
        }
    };


    const duplicateSection = (sectionId) => {
        setSections((prevSections) => {
            const index = prevSections.findIndex((s) => s.id === sectionId);
            if (index === -1) return prevSections;

            const original = prevSections[index];

            // Deep clone original section
            const copy = JSON.parse(JSON.stringify(original));

            // Generate new IDs for the copy and nested items
            copy.id = uuidv4();
            copy.order = original.order + 1; // new order right after original

            if (copy.codeFiles) {
                copy.codeFiles = copy.codeFiles.map((f) => ({
                    ...f,
                    id: uuidv4(),
                }));
            }
            if (copy.mediaFiles) {
                copy.mediaFiles = copy.mediaFiles.map((m) => ({
                    ...m,
                    id: uuidv4(),
                }));
            }

            // Insert copy after original
            const updated = [
                ...prevSections.slice(0, index + 1),
                copy,
                ...prevSections.slice(index + 1),
            ];

            // Fix order for all sections (increment orders after inserted position)
            return updated.map((section, i) => ({
                ...section,
                order: i + 1,
            }));
        });
    };

    // Add new empty code file
    const handleAddCodeFile = (sectionId) => {
        setSections((prev) =>
            prev.map((section) => {
                if (section.id !== sectionId) return section;
                const newFile = {
                    id: `code${Date.now()}`,
                    order: section.codeFiles.length + 1,
                    filename: `newfile${section.codeFiles.length + 1}.txt`,
                    language: "text",
                    content: "",
                };
                return { ...section, codeFiles: [...section.codeFiles, newFile] };
            })
        );
        setSelectedTabs((prev) => ({
            ...prev,
            code: { ...prev.code, [sectionId]: (sections.find(s => s.id === sectionId)?.codeFiles.length || 0) },
        }));
    };

    // Add new empty media file
    const handleAddMediaFile = (sectionId) => {
        setSections((prev) =>
            prev.map((section) => {
                if (section.id !== sectionId) return section;
                const newFile = {
                    id: `media${Date.now()}`,
                    order: section.mediaFiles.length + 1,
                    url: "",
                    description: "",
                    mediaDescription: "",
                    mediaWidth: "",
                    mediaHeight: "",
                };
                return { ...section, mediaFiles: [...section.mediaFiles, newFile] };
            })
        );
        setSelectedTabs((prev) => ({
            ...prev,
            media: { ...prev.media, [sectionId]: (sections.find(s => s.id === sectionId)?.mediaFiles.length || 0) },
        }));
    };

    // Reorder files utility
    const handleReorderFile = (sectionId, type, fileId, direction) => {
        setSections((prevSections) =>
            prevSections.map((section) => {
                if (section.id !== sectionId) return section;

                const files = [...section[type]];
                const idx = files.findIndex((f) => f.id === fileId);
                if (idx === -1) return section;

                const newIndex = idx + direction;
                if (newIndex < 0 || newIndex >= files.length) return section;

                [files[idx], files[newIndex]] = [files[newIndex], files[idx]];
                files.forEach((file, i) => {
                    file.order = i + 1;
                });

                return { ...section, [type]: files };
            })
        );
    };

    // Utility: Add or update recent files list (max 10)
    const addToRecentFiles = (newFile) => {
        try {
            let files = [...recentFiles];
            // Remove existing with same id
            files = files.filter((f) => f.id !== newFile.id);
            // Add new to front
            files.unshift(newFile);
            // Keep max 10 files
            if (files.length > 10) files = files.slice(0, 10);
            setRecentFiles(files);
            localStorage.setItem(RECENT_FILES_KEY, JSON.stringify(files));
        } catch (e) {
            console.warn("Failed to update recent files", e);
        }
    };

    const handleLoadRecentFile = async (file) => {
        if (!file.fileName) return;

        // If you have URLs or local files, fetch/load them accordingly.
        // Assuming you load from localStorage or file system or make a network fetch
        // Example: If url points to fetchable JSON:
        try {
            if (file.url) {
                const response = await fetch(file.url);
                if (!response.ok) throw new Error("Network error");
                const data = await response.json();
                setSections(data);
            } else {
                // If no URL, fallback or show message
                alert("No URL available to load this file.");
            }
            setCurrentFileName(file.fileName);
            setTab(0); // Switch to edit tab
        } catch (e) {
            console.error("Failed to load recent file:", e);
            alert("Failed to load the recent file.");
        }
    };

    const updateRecentFiles = (updatedFiles) => {
        setRecentFiles(updatedFiles);
        localStorage.setItem(RECENT_FILES_KEY, JSON.stringify(updatedFiles));
    };
     return (
        
        <div className="flex min-h-screen flex-col h-full w-full bg-gray-100">
            
            <FileAppBar 
  drawerOpen={drawerOpen} 
  setDrawerOpen={setDrawerOpen}
  setHideUI={setHideUI}
  hideUI={hideUI}
  currentFileName={currentFileName}
sectionRefs={sectionRefs}
handleLoadSectionsJSON={handleLoadSectionsJSON}
  handleSaveFile={handleSaveFile}
  handleAddSection={handleAddSection}
  handleShowPreview={handleShowPreview}
  handleShowEdit={handleShowEdit}
tab={tab}
  onReorderCodeFile={(sectionId, fileId, direction) =>
    handleReorderFile(sectionId, "codeFiles", fileId, direction)
  }

  onReorderMediaFile={(sectionId, mediaId, direction) =>
    handleReorderFile(sectionId, "mediaFiles", mediaId, direction)
  }
/>
             {/* Hidden file input */}
    <input
      type="file"
      ref={fileInputRef}
      hidden
      accept=".json"
      onChange={handleOpenFile}
    />
         <Box
  sx={{
    height: {sm: 36, md: 40 },
    display: { xs: "none", sm: hideUI ? "none" : "block" }
  }}
/>
            <Container
                sx={{
                    width: "100%",
                    mx: "auto",
                    py: 2,
                    px:0, // Add some horizontal padding
                    background: "#fff",
                    borderRadius: 1,
                    boxShadow: 2,
                    border: "1px solid #e5e7eb",
                    minHeight: "88vh",
                    display: "flex",
                    flexDirection: "column",
                    overflowX: "visible",
                    alignItems: "stretch",
                    justifyContent: "flex-start",
                }}
            //maxWidth={false} // REMOVED to enforce the maxWidth above
            >
                <Fade in={tab === 0} timeout={300} unmountOnExit>
                    <div>
                    <Box sx={{ width: "100%" }}>
                        <EditorTimeLine sx={{ width: "100%" }}
                            hideUI={hideUI} // <--- Pass the prop here
                            sections={sections}
                            tab={tab}
                            setTab={setTab}
                            sectionRefs={sectionRefs}
                            handleCloneSection={handleCloneSection}
                            handlePasteSection={handlePasteSection}
                            duplicateSection={duplicateSection}
                            onChange={handleChange}
                            onDelete={handleDelete}
                            onAddCodeFile={handleAddCodeFile}
                            onAddMediaFile={handleAddMediaFile}
   selectedTabs={selectedTabs}
                            onReorderCodeFile={(sectionId, fileId, direction) =>
                                handleReorderFile(sectionId, "codeFiles", fileId, direction)
                            }
                            onReorderMediaFile={(sectionId, mediaId, direction) =>
                                handleReorderFile(sectionId, "mediaFiles", mediaId, direction)
                            }
                            
                            onSelectedTabChange={(sectionId, tabType, newIndex) => {
                                setSelectedTabs((prev) => ({
                                    ...prev,
                                    [tabType]: {
                                        ...prev[tabType],
                                        [sectionId]: newIndex,
                                    },
                                }));
                            }}
                        />

                    </Box>
                </div>
                </Fade>

                <Fade in={tab === 1} timeout={300} unmountOnExit>
                    <div>
                        <StyledPreviewTimeline sections={sections} />
                    </div>
                    </Fade>
            </Container>
                    <Fab
  color="primary"
  aria-label="scroll-top"
  onClick={handleScrollTop}
  sx={{
    ...scrollFabStyle,
    bottom: { xs: 80, sm: 100 },
    zIndex: (theme) => theme.zIndex.drawer + 2
  }}
>
  <KeyboardArrowUpIcon sx={{ fontSize: { xs: 16, sm: 24 } }} />
</Fab>
<Fab
  color="secondary"
  aria-label="scroll-bottom"
  onClick={handleScrollBottom}
  sx={{
    ...scrollFabStyle,
    bottom: { xs: 16, sm: 32 },
    zIndex: (theme) => theme.zIndex.drawer + 2
  }}
>
  <KeyboardArrowDownIcon sx={{ fontSize: { xs: 16, sm: 24 } }} />
</Fab>

        </div >
    );
}
    