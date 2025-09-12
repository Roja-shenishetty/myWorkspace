import React, { useState } from "react";
import AnimatedSlogan from "../../components/shared/AnimatedSlogan/AnimatedSlogan";
import MatrixRain from "./MatrixRain";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import CircularTextSpinner from "../../components/shared/circular-text-spinner/CircularTextSpinner";

const HeroSection = () => {
  const [effect, setEffect] = useState("typewriter");
  const slogans = ["Understand", "Implement", "Innovate", "Lead"];
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <div className="mt-10 flex flex-col items-center justify-center bg-gray-100">
      {/* 
        <div className="h-32 w-full bg-gradient-to-r from-saffron via-white to-india-green flex items-center justify-center">
          <h1 className="text-chakraBlue font-bold">🇮🇳 Tricolor Gradient</h1>
        </div>
        <div className="h-32 w-full bg-gradient-to-br from-saffron to-india-green flex items-center justify-center">
          <h1 className="text-white font-bold">Diagonal Gradient</h1>
        </div> 
      */}

      <div
        className="relative w-full flex flex-col md:flex-row items-center 
        justify-center min-h-[360px] md:min-h-[500px] py-8 md:py-16 bg-tricolor"
      >
        {/* <div className="mb-4 md:mb-0">
          <CircularTextSpinner />
        </div> */}
        {/* Animated Border Card */}
        <div className="relative group max-w-full md:max-w-fit overflow-x-auto">
          {/* Animated Border */}
          <div className="absolute inset-0 rounded-2xl 
          border-4 
          border-white
          border-transparent 
          group-hover:border-teal-400 
          pointer-events-none 
          after:content-[''] 
          after:absolute 
          after:inset-0 
          after:rounded-2xl 
          -after:border-4 
          after:border-teal-400 
          after:opacity-40 
          after:animate-pulse"
          />
          {/* Main Card */}
          <div className="relative z-10  rounded-2xl shadow-xl px-4 
          py-6 md:px-8 md:py-8 flex 
          flex-col md:flex-row
           items-center transition-all duration-300">

            <div className="mb-4 md:mb-0">
          <CircularTextSpinner /> 
        </div> &nbsp;&nbsp;&nbsp;&nbsp;
            <Box>
              {/* <MatrixRain /> */}
            </Box>
            <Box
              sx={{
                display: "flex",
                ml: { xs: 0, md: 10 },
                mt: { xs: 6, md: 0 },
                flexDirection: "column",
                alignItems: isMobile ? "center" : "flex-start",
                width: "100%",
                minWidth:295,
              }}
            >
              <AnimatedSlogan
                words={slogans}
                effect={effect}
                interval={2000}
                sx={{
                  fontWeight: 700,
                  fontSize: isMobile ? "1.25rem" : "2.5rem",
                  textAlign: isMobile ? "center" : "left",
                  wordBreak: "break-word",
                  width: "100%",
                  maxWidth: "100%",
                }}
              />
              {/* <div className="mt-4 text-lg font-semibold text-blue text-center md:text-left max-w-full">
                 Your Learning Journey Starts here 
              </div> */}
            </Box>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
