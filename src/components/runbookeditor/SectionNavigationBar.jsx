import React, { useEffect, useRef } from 'react';
import { Box, Fab } from "@mui/material";

// 1. EXTRACT NavigationBar OUTSIDE of EditorTimeline
const SectionNavigationBar = ({
    sections,
    displayMode,
    setDisplayMode,
    selectedHorizontalSection,
    handleNavigate, hideUI
}) => {
    const navScrollRef = useRef(null);

    // 1. Auto-scroll the NAV BAR to keep the active button in view
    useEffect(() => {
        if (navScrollRef.current && selectedHorizontalSection) {
            // Find the button with the matching data-id
            const activeBtn = navScrollRef.current.querySelector(`button[data-id="${selectedHorizontalSection}"]`);

            if (activeBtn) {
                activeBtn.scrollIntoView({
                    behavior: 'smooth',
                    inline: 'center', // This keeps the selected button in the middle of the bar
                    block: 'nearest'
                });
            }
        }
    }, [selectedHorizontalSection]);

    // 2. Enhanced Click Handler with Offset for Vertical Scroll
    const onSectionClick = (sectionId) => {
        // Trigger the parent state update
        handleNavigate(sectionId);

        // Force Vertical Scroll with Offset (Fixes content hiding behind header)
        if (displayMode === 'vertical') {
            const sectionElement = document.getElementById(`section-${sectionId}`);
            if (sectionElement) {
                const headerOffset = 180; // Height of your fixed headers (114px + Nav Bar Height)
                const elementPosition = sectionElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                gap: 0,
                top: hideUI ? 55 :114,
                //top: 114, // Fits below your main app bar
                p: 1,
                position: "fixed",
                width: "90%",
                backgroundColor: "white", // Solid background prevents transparency issues
                mb: 1,
                overflowX: "auto",
                pb: 1,
                zIndex: 100,
                borderBottom: "1px solid #eee", // Visual separation
                "&::-webkit-scrollbar": { height: 4 },
                "&::-webkit-scrollbar-thumb": { backgroundColor: "#ccc", borderRadius: 2 }
            }}
        >
            {/* Mode Toggle Button */}
            <Box sx={{ display: "flex", gap: 1, position: "sticky", left: 0, backgroundColor: "white", zIndex: 1111, pr: 2 }}>
                <Fab
                    onClick={() => setDisplayMode(displayMode === 'vertical' ? "horizontal" : "vertical")}
                    size="medium"
                    color={displayMode === "vertical" ? "warning" : "success"}
                    sx={{ flexShrink: 0, fontWeight: 'bold', boxShadow: 2 }}
                >
                    {displayMode === "vertical" ? "V" : "H"}
                </Fab>
            </Box>

            {/* Scrollable Number Buttons */}
            <Box
                ref={navScrollRef}
                sx={{ width: "100%", display: "flex", gap: 1, backgroundColor: "white", alignItems: "center" }}
            >
                {sections.map((section, i) => (
                    <Fab
                        key={section.id}
                        data-id={section.id} // Important for the useEffect querySelector
                        size="medium"
                        color={selectedHorizontalSection === section.id ? "primary" : "default"}
                        onClick={() => onSectionClick(section.id)}
                        sx={{
                            flexShrink: 0,
                            fontWeight: 'bold',
                            minWidth: '48px', // Ensure circle shape isn't squashed
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {i + 1}
                    </Fab>
                ))}
            </Box>
        </Box>
    );
};

export default SectionNavigationBar;