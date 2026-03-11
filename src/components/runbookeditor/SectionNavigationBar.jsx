import React, { useEffect, useRef } from 'react';
import { Box, Fab, Tooltip,Paper,Stack,Divider } from "@mui/material";

const minimalFab = {
  width: { xs: 28, sm: 34 },
  height: { xs: 28, sm: 34 },
  minHeight: "unset",
  backgroundColor: "#ffffff",
  color: "#374151",
  borderRadius: "8px",
  border: "1px solid #e5e7eb",
  boxShadow: "none",
  transition: "all 0.18s ease",

  "&:hover": {
    backgroundColor: "rgba(25,118,210,0.5)",
    transform: "translateY(-1px)",
    boxShadow: "0 3px 8px rgba(0,0,0,0.06)"
  }
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
    borderRadius: "2px",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    boxShadow: { xs: "0 2px 8px rgba(0,0,0,0.04)", sm: "0 6px 24px rgba(0,0,0,0.04)" },
    mt: 0,
    mb: 2,
    px: { xs: 0.5, sm: 1 },
    py: { xs: 0.5, sm: 0.8 },
    position: "sticky",
    top: { xs: "72px", sm: "80px" },
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    gap: 1
  }}
>
  {/* Toggle Button */}
  <Tooltip
    title={
      displayMode === "vertical"
        ? "Switch to Horizontal View"
        : "Switch to Vertical View"
    }
    arrow
  >
    <Fab
      onClick={() =>
        setDisplayMode(displayMode === "vertical" ? "horizontal" : "vertical")
      }
      sx={{
        ...minimalFab,
        flexShrink: 0, // prevent shrinking
        fontSize: { xs: "0.65rem", sm: "0.8rem" }
      }}
    >
      {displayMode === "vertical" ? "V" : "H"}
    </Fab>
  </Tooltip>

  <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

  {/* Scrollable Section Buttons */}
  <Box
    ref={navScrollRef}
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1,
      overflowX: "auto",
      flex: 1,
      minWidth: 0,
       /* Hide scrollbar */
    scrollbarWidth: "none",        // Firefox
    msOverflowStyle: "none",       // IE/Edge
    "&::-webkit-scrollbar": {
      display: "none"              // Chrome / Safari
      }
    }}
  >
    {sections.map((section, i) => (
      <Tooltip
        key={section.id}
        title={`Go to ${section.title || `Section ${i + 1}`}`}
        arrow
      >
        <Fab
          data-id={section.id}
          onClick={() => onSectionClick(section.id)}
          sx={{
            ...minimalFab,
            flexShrink: 0,
            fontSize: { xs: "0.65rem", sm: "0.8rem" },
            backgroundColor:
              selectedHorizontalSection === section.id
                ? "rgba(25,118,210)"
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
</Paper>
    );
};

export default SectionNavigationBar;