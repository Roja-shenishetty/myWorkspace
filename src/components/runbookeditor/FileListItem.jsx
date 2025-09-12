import React from "react";
import { IconButton, Tooltip, ListItem, ListItemText, Link, Box } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import ShareIcon from "@mui/icons-material/Share";
import DeleteIcon from "@mui/icons-material/Delete";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

function CustomSecondaryActions({ children }) {
    return (
        <Box
            sx={{
                //position: "absolute",
                //   right: 16,
                //  top: "50%",
                //  transform: "translateY(-50%)",
                //   display: "flex",
                //    gap: 0.5,
            }}
        >
            {children}
        </Box>
    );
}

export default function FileListItem({ file, handleOpenInfo, handleShare, handleDelete, handleWhatsAppShare }) {
    return (

        <Box >       
         <Tooltip title="Edit annotation">
            <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleOpenInfo(e, file); }}>
                <InfoIcon />
            </IconButton>
        </Tooltip>

            <Tooltip title="Share this file">
                <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleShare(file, e); }}>
                    <ShareIcon />
                </IconButton>
            </Tooltip>

            <Tooltip title="Remove from recent">
                <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleDelete(file.id, e); }}>
                    <DeleteIcon />
                </IconButton>
            </Tooltip>

            <Tooltip title="Share on WhatsApp">
                <IconButton size="small" sx={{ color: '#25D366' }} onClick={(e) => { e.stopPropagation(); handleWhatsAppShare(file, e); }}>
                    <WhatsAppIcon />
                </IconButton>
            </Tooltip>
        </Box>
    );
}
