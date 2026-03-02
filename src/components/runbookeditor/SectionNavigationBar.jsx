import React, { useEffect, useRef } from 'react';
import { Box, Fab, Tooltip,Paper,Stack,Divider } from "@mui/material";

const minimalFab = {
  width: 38,
  height: 38,
  minHeight: 38,
  backgroundColor: "#f9fafb",
  color: "#374151",
  borderRadius: "10px",
  boxShadow: "none",
  border: "1px solid #e5e7eb",
  transition: "all 0.18s ease",
  "&:hover": {
    backgroundColor: "rgba(25, 118, 210, 0.06)",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    color:"rgba(0,0,0,0.5)"
  },
};
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
         <Paper
    elevation={0}
    sx={{
      width: "100%",
      borderRadius: "3px",
      backgroundColor: "#ffffff",
      border: "1px solid #e5e7eb",
      boxShadow: "0 6px 24px rgba(0,0,0,0.04)",
      p: 0.5,
      mt: 1
    }}
  >
    <Stack direction="row" alignItems="center" spacing={1}>
      
      {/* Mode Toggle */}
      <Tooltip
        title={displayMode === "vertical"
          ? "Switch to Horizontal View"
          : "Switch to Vertical View"}
        arrow
      >
        <Fab
          onClick={() =>
            setDisplayMode(displayMode === "vertical" ? "horizontal" : "vertical")
          }
          sx={minimalFab}
        >
          {displayMode === "vertical" ? "V" : "H"}
        </Fab>
      </Tooltip>

      <Divider orientation="vertical" flexItem />

      {/* Scrollable Section Buttons */}
      <Box
        ref={navScrollRef}
        sx={{
          display: "flex",
          gap: 1,
          overflowX: "auto",
          alignItems: "center",
          width: "100%",
          "&::-webkit-scrollbar": { height: 4 },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#ccc",
            borderRadius: 2
          }
        }}
      >
        {sections.map((section, i) => (
          <Tooltip
            key={section.id}
            title={`Go to Section ${i + 1}`}
            arrow
          >
            <Fab
              data-id={section.id}
              onClick={() => onSectionClick(section.id)}
              sx={{
                ...minimalFab,
                backgroundColor:
                  selectedHorizontalSection === section.id
                    ? "rgba(25, 118, 210)"
                    : "#f5f5f5",
                color:
                  selectedHorizontalSection === section.id
                    ? "#fff"
                    : "#333"
              }}
            >
              {i + 1}
            </Fab>
          </Tooltip>
        ))}
      </Box>

    </Stack>
  </Paper>
    );
};

export default SectionNavigationBar;