import React from "react";
import { Button, Card, CardContent, Typography } from "@mui/material";

export default function ThemeTestMixed() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-6 p-8">
      {/* Tailwind for layout + colors */}
      <h1 className="text-4xl font-bold text-chakraBlue">
        🇮🇳 Tailwind + MUI Together
      </h1>

      {/* MUI Button using theme */}
      <Button variant="contained" color="primary">
        MUI Primary (Saffron)
      </Button>
      <Button variant="contained" color="secondary">
        MUI Secondary (Green)
      </Button>

      {/* Tailwind Buttons */}
      <div className="flex gap-4">
        <button className="bg-saffron text-white px-6 py-3 rounded-lg hover:bg-indiaGreen transition">
          Tailwind Saffron
        </button>
        <button className="bg-indiaGreen text-white px-6 py-3 rounded-lg hover:bg-saffron transition">
          Tailwind Green
        </button>
      </div>

      {/* MUI Card + Tailwind spacing */}
      <Card className="w-3/4 shadow-lg">
        <CardContent className="text-center">
          <Typography variant="h5" color="info.main" gutterBottom>
            Chakra Blue Heading (MUI Theme)
          </Typography>
          <p className="text-gray-600">
            This is a <code>MUI Card</code> styled with both Tailwind classes
            and MUI theme colors.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
