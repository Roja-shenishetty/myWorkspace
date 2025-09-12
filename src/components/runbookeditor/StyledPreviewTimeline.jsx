import React, { useState } from "react";
import MarkdownViewer from "../shared/simple-markdown/MarkdownViewer";
import UrlDropPreviewCard from "../shared/UrlDropPreviewCard/UrlDropPreviewCard";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MonacoPreviewCode from "./MonacoPreviewCode";
import {
  Box,
  Typography
} from "@mui/material";

export default function StyledPreviewTimeline({ sections }) {
  const [copiedId, setCopiedId] = useState(null);
  const [activeTab, setActiveTab] = useState({}); // { sectionId: fileIndex }


  const handleCopy = (id, code) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="flex flex-col gap-1">
      {sections.map((section, idx) => (
        <div key={section.id} className="relative group pb-8">
          {/* Timeline number dot */}
          <div className="absolute left-0 flex flex-col items-center">
            <div className="border bg-gray-100 border-gray-400 flex items-center justify-center rounded-full w-6 h-6 text-xs text-gray-800 font-mono shadow z-10">
              {section.order}
            </div>
          </div>
          {/* Vertical line */}
          <div className="absolute w-px left-[11px] pt-1 h-full z-0">
            <div className="absolute w-full h-full py-1 bg-gray-300 group-last:bg-transparent"></div>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-10 lg:ml-12">
            {/* Left column: Title & description */}
            <div className="col-span-5 ml-12 lg:ml-0">
              <h3 className="mt-0 text-gray-800 text-base font-semibold">
                {section.title}
              </h3>
              <Box display="flex" alignItems="center" gap={2} mb={1}>
                {section.timeToRead !== undefined && section.timeToRead > 0 && (
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <AccessTimeIcon fontSize="small" />
                    <Typography variant="caption" color="textSecondary">
                      {section.timeToRead} min read
                    </Typography>
                  </Box>
                )}
                {section.timeToRun !== undefined && section.timeToRun > 0 && (
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <AccessTimeIcon fontSize="small" />
                    <Typography variant="caption" color="textSecondary">
                      {section.timeToRun} min run
                    </Typography>
                  </Box>
                )}
              </Box>
              <MarkdownViewer content={section.description}></MarkdownViewer>
            </div>

            {/* Right column: Files + Media */}
            <div className="col-span-7 space-y-6">
              {/* ================= CODE FILES ================= */}
              {section.codeFiles?.length > 0 && (
                <div>
                  {/* Tabs for filenames */}
                  <div className="flex space-x-2 mb-2">
                    {section.codeFiles.map((file, fIdx) => (
                      <button
                        key={file.id}
                        className={`px-3 py-1 border rounded text-xs ${activeTab[section.id] === fIdx ||
                          (activeTab[section.id] === undefined && fIdx === 0)
                          ? "bg-gray-200 font-semibold"
                          : "bg-gray-50 hover:bg-gray-100"
                          }`}
                        onClick={() =>
                          setActiveTab((prev) => ({ ...prev, [section.id]: fIdx }))
                        }
                      >
                        {file.order}. {file.filename}
                      </button>
                    ))}
                  </div>

                  {section.codeFiles.map((file, fIdx) => {
                    const isActive =
                      activeTab[section.id] === fIdx ||
                      (activeTab[section.id] === undefined && fIdx === 0);
                    if (!isActive) return null;

                    return (
                      <>
                        <MonacoPreviewCode
                          key={file.id}
                          code={file.content || ""}
                          language={file.language}
                        />
                      </>
                    );
                  })}
                </div>
              )}

              {/* ================= MEDIA FILES ================= */}
              {section.mediaFiles?.length > 0 && (
                <div>
                  <div className="flex space-x-2 mb-2">
                    {section.mediaFiles.map((media, mIdx) => (
                      <button
                        key={media.id}
                        className={`px-3 py-1 border rounded text-xs ${activeTab[`media-${section.id}`] === mIdx ||
                          (activeTab[`media-${section.id}`] === undefined &&
                            mIdx === 0)
                          ? "bg-gray-200 font-semibold"
                          : "bg-gray-50 hover:bg-gray-100"
                          }`}
                        onClick={() =>
                          setActiveTab((prev) => ({
                            ...prev,
                            [`media-${section.id}`]: mIdx,
                          }))
                        }
                      >
                        {media.order}. Media
                      </button>
                    ))}
                  </div>

                  {section.mediaFiles.map((media, mIdx) => {
                    const isActive =
                      activeTab[`media-${section.id}`] === mIdx ||
                      (activeTab[`media-${section.id}`] === undefined &&
                        mIdx === 0);
                    if (!isActive) return null;

                    return (
                      <div key={media.id} className="space-y-2">
                        <p className="text-sm text-gray-700">
                          {media.description}
                        </p>
                        <UrlDropPreviewCard
                          value={{ url: media.url }}
                          showJustUrl={true}
                          width="100%"
                          height={200}
                          printMode={true}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
