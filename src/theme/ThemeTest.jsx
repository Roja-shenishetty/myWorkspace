import React from "react";

export default function ThemeTest() {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center gap-8 p-8">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-chakraBlue mb-2">
          🇮🇳 Proudly Indian with Tailwind
        </h1>
        <p className="text-lg text-saffron">
          Testing Indian Flag Themed Colors
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <button className="bg-saffron text-white px-6 py-3 rounded-lg hover:bg-indiaGreen transition">
          Primary (Saffron)
        </button>
        <button className="bg-indiaGreen text-white px-6 py-3 rounded-lg hover:bg-saffron transition">
          Secondary (Green)
        </button>
        <button className="border-2 border-chakraBlue text-chakraBlue px-6 py-3 rounded-lg hover:bg-chakraBlue hover:text-white transition">
          Info (Chakra Blue)
        </button>
      </div>

      {/* Gradient Test */}
      <div className="w-3/4 h-32 bg-tricolor flex items-center justify-center rounded-xl shadow-md">
        <span className="text-xl font-semibold text-chakraBlue">
          Tricolor Gradient Background
        </span>
      </div>

      {/* Card / Section Test */}
      <div className="bg-white p-6 rounded-xl shadow-md w-3/4 text-center">
        <h2 className="text-2xl font-semibold text-indiaGreen mb-2">
          Section Title
        </h2>
        <p className="text-gray-700">
          This card uses <code>bg-white</code> and <code>shadow</code> with
          Indian theme colors inside.
        </p>
      </div>
    </div>
  );
}
