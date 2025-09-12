import React, { useState, useEffect } from "react";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { motion } from "framer-motion";
import Typewriter from "typewriter-effect";
import "./gradient.css"; // Keep if you want your gradient styling

const effects = {
  typewriter: ({ words }) => (
    <Typewriter
      options={{ strings: words, autoStart: true, loop: true, delay: 45 }}
    />
  ),
  fade: ({ word }) => (
    <motion.div
      key={word}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {word}
    </motion.div>
  ),
  slide: ({ word }) => (
    <motion.div
      key={word}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
    >
      {word}
    </motion.div>
  ),
};

const AnimatedSlogan = ({ words, effect = "typewriter", interval = 3000 }) => {
  const [index, setIndex] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (effect === "typewriter") return;
    const timer = setInterval(
      () => setIndex((prev) => (prev + 1) % words.length),
      interval
    );
    return () => clearInterval(timer);
  }, [effect, words, interval]);

  const EffectComponent = effects[effect];

  // Parent Box for responsive font sizing and center alignment
  return (
    <Box
      sx={{
        width: "100%",
        textAlign: "center",
        px: 2,
        py: 1,
      }}
    >
      <Typography
        variant={isMobile ? "h2" : "h3"}
        sx={{
          fontWeight: 700,
          wordBreak: "break-word",
          fontSize: { xs: "2.25rem", sm: "2.2rem", md: "3rem" },
          mx: "auto",
          maxWidth: "100vw",
          backgroundColor:"white",
          padding:2,
          borderRadius:"12px"
        }}
        className="gradient-text "
      >
        {effect === "typewriter" ? (
          <Typewriter
            options={{
              strings: words,
              autoStart: true,
              loop: true,
              delay: 45,
              deleteSpeed: 30,
              pauseFor: interval,
            }}
          />
        ) : (
          <EffectComponent word={words[index]} words={words} />
        )}
      </Typography>
    </Box>
  );
};

export default AnimatedSlogan;
