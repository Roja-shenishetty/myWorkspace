import React, { useRef, useState, useEffect } from "react";

export default function CameraRecorder({ onUpload }) {
  const mediaRecorderRef = useRef(null);
  const timerRef = useRef(null);
  const [status, setStatus] = useState("idle"); // 'idle', 'recording', 'preview'
  const [videoBlob, setVideoBlob] = useState(null);
  const [includeMic, setIncludeMic] = useState(true);
  const [recordTime, setRecordTime] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    return () => clearInterval(timerRef.current); // cleanup timer
  }, []);

  const startRecording = async () => {
    setStatus("recording");
    setError(null);
    setVideoBlob(null);
    try {
      const constraints = {
        video: true,
        audio: includeMic,
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });

      const chunks = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        setVideoBlob(blob);
        setStatus("preview");
        // Stop all tracks so camera and mic turn off
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      mediaRecorderRef.current = recorder;

      setRecordTime(0);
      timerRef.current = setInterval(() => {
        setRecordTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Error accessing camera/microphone:", err);
      setError("Could not start recording. Please grant permissions.");
      setStatus("idle");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      clearInterval(timerRef.current);
    }
  };

  const handleReset = () => {
    setStatus("idle");
    setVideoBlob(null);
    setRecordTime(0);
    setError(null);
  };

  const handleUpload = () => {
    if (videoBlob && onUpload) {
      onUpload(videoBlob);
    }
  };

  const formatTime = (sec) =>
    `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;

  const videoUrl = videoBlob ? URL.createObjectURL(videoBlob) : null;

  return (
    <div>
      <div>
        {status === "idle" && (
          <>
            <label>
              <input
                type="checkbox"
                checked={includeMic}
                onChange={(e) => setIncludeMic(e.target.checked)}
              />{" "}
              Include Microphone
            </label>
            <button onClick={startRecording}>Start Recording</button>
          </>
        )}

        {status === "recording" && (
          <>
            <div>Recording... {formatTime(recordTime)}</div>
            <button onClick={stopRecording}>Stop Recording</button>
          </>
        )}

        {status === "preview" && videoUrl && (
          <>
            <video src={videoUrl} controls autoPlay loop style={{ width: "100%", maxWidth: 480 }} />
            <button onClick={handleUpload}>Upload</button>
            <button onClick={handleReset}>Delete</button>
          </>
        )}

        {error && <div style={{ color: "red" }}>{error}</div>}
      </div>
    </div>
  );
}
