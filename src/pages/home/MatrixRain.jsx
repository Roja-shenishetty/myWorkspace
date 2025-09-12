import React, { useRef, useEffect } from "react";

const MatrixRain = ({ width = 300, height = 200 }) => {
    const canvasRef = useRef();


    function randomInternationalChar() {
        // Each entry: [start, end] (Unicode codepoints)
        const ranges = [
            [0x0041, 0x005A], // Latin A-Z
            [0x0391, 0x03A9], // Greek uppercase
            [0x0410, 0x044F], // Cyrillic
            [0x0905, 0x0939], // Devanagari
            [0x0627, 0x064A], // Arabic
            [0x4E00, 0x9FFF], // CJK Unified Ideographs
        ];
        const range = ranges[Math.floor(Math.random() * ranges.length)];
        const code = Math.floor(Math.random() * (range[1] - range + 1)) + range;
        return String.fromCharCode(code);
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const cols = Math.floor(width / 20);
        const ypos = Array(cols).fill(0);

        function randomChar() {

            // Pick Devanagari characters, e.g. क (U+0915) to ह (U+0939)
            const codeStart = 0x0915;
            const codeEnd = 0x0939;
            const charCode = Math.floor(Math.random() * (codeEnd - codeStart + 1)) + codeStart;
            return String.fromCharCode(charCode);

            // Unicode Katakana range for Matrix effect
            // return String.fromCharCode(0x30A0 + Math.random() * 96);
        }

        function matrix() {
            ctx.fillStyle = "rgba(0,0,0,0.2)";
            ctx.fillRect(0, 0, width, height);

            ctx.font = "bold 18px monospace";
            ctx.fillStyle = "#34d399"; // Tailwind teal-400

            for (let i = 0; i < cols; i++) {
                const text = randomChar();
               // const text = randomInternationalChar();
                ctx.fillText(text, i * 20, ypos[i] * 20);

                if (Math.random() > 0.975 || ypos[i] * 20 > height) {
                    ypos[i] = 0;
                }
                ypos[i]++;
            }
        }

        const interval = setInterval(matrix, 100);
        return () => clearInterval(interval);
    }, [width, height]);

    return (
        <canvas
            ref={canvasRef}
            width={width}
            height={height}
            style={{
                background: "#fff",
                borderRadius: "1rem",
                boxShadow: "0 8px 32px rgba(44, 208, 162, 0.15)",
                display: "block",
            }}
            aria-label="Matrix code rain"
        />
    );
};

export default MatrixRain;
