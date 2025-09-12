import React, { useRef, useState, useEffect } from "react";

export default function ScreenCameraRecorder({ onUpload }) {
  const canvasRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const timerRef = useRef(null);

  const screenVideoRef = useRef(null);
  const cameraVideoRef = useRef(null);

  const [status, setStatus] = useState("idle"); // idle, recording, preview
  const [videoBlob, setVideoBlob] = useState(null);
  const [includeMic, setIncludeMic] = useState(true);
  const [recordTime, setRecordTime] = useState(0);
  const [error, setError] = useState(null);

  const [screenStream, setScreenStream] = useState(null);
  const [cameraStream, setCameraStream] = useState(null);
  const [compositeStream, setCompositeStream] = useState(null);

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      stopAllStreams();
    };
  }, []);

  // Stop all active streams
  const stopAllStreams = () => {
    if (screenStream) {
      screenStream.getTracks().forEach((t) => t.stop());
      setScreenStream(null);
    }
    if (cameraStream) {
      cameraStream.getTracks().forEach((t) => t.stop());
      setCameraStream(null);
    }
    if (compositeStream) {
      compositeStream.getTracks().forEach((t) => t.stop());
      setCompositeStream(null);
    }
  };

  const startRecording = async () => {
    setStatus("recording");
    setError(null);
    setVideoBlob(null);

    try {
      const screen = await navigator.mediaDevices.getDisplayMedia({
        video: { cursor: "always" },
        audio: includeMic,
      });

      let camera = null;
      if (includeMic) {
        camera = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
      } else {
        camera = await navigator.mediaDevices.getUserMedia({ video: true });
      }

      setScreenStream(screen);
      setCameraStream(camera);

      // Play the raw streams invisibly
      if (screenVideoRef.current) screenVideoRef.current.srcObject = screen;
      if (cameraVideoRef.current) cameraVideoRef.current.srcObject = camera;

      // Start drawing combined frames on canvas
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      // Size canvas to screen video size (will update later)
      const videoTrackSettings = screen.getVideoTracks()[0].getSettings();
      canvas.width = videoTrackSettings.width || 1280;
      canvas.height = videoTrackSettings.height || 720;

      // Draw loop
      const draw = () => {
        if (!status === "recording") return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the screen video fullscreen
        if (screenVideoRef.current) {
          ctx.drawImage(screenVideoRef.current, 0, 0, canvas.width, canvas.height);
        }

        // Draw camera video smaller at bottom-left corner (avatar style)
        if (cameraVideoRef.current) {
          const camWidth = canvas.width / 5;
          const camHeight = (cameraVideoRef.current.videoHeight / cameraVideoRef.current.videoWidth) * camWidth;

          ctx.drawImage(
            cameraVideoRef.current,
            10,
            canvas.height - camHeight - 10,
            camWidth,
            camHeight
          );
        }

        requestAnimationFrame(draw);
      };

      draw();

      // Capture canvas stream at screen fps or 30fps default
      const recordedStream = canvas.captureStream(videoTrackSettings.frameRate || 30);

      // Combine audio tracks (screen + mic)
      if (includeMic) {
        const audioContext = new AudioContext();
        const destination = audioContext.createMediaStreamDestination();

        if (screen.getAudioTracks().length > 0) {
          const source1 = audioContext.createMediaStreamSource(screen);
          source1.connect(destination);
        }
        if (camera.getAudioTracks().length > 0) {
          const source2 = audioContext.createMediaStreamSource(camera);
          source2.connect(destination);
        }
        // Add combined audio tracks to recorded stream
        destination.stream.getAudioTracks().forEach((track) => {
          recordedStream.addTrack(track);
        });
      }

      setCompositeStream(recordedStream);

      const chunks = [];
      const recorder = new MediaRecorder(recordedStream, {
        mimeType: "video/webm",
      });

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        setVideoBlob(blob);
        setStatus("preview");
        stopAllStreams();
      };

      recorder.start();
      mediaRecorderRef.current = recorder;

      setRecordTime(0);
      timerRef.current = setInterval(() => {
        setRecordTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Error starting combined recording:", err);
      setError("Could not start recording. Please grant permission and try again.");
      setStatus("idle");
      stopAllStreams();
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
    stopAllStreams();
  };

  const handleUpload = () => {
    if (!videoBlob || !onUpload) return;
    onUpload(videoBlob);
  };

  const formatTime = (sec) =>
    `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;

  const videoUrl = videoBlob ? URL.createObjectURL(videoBlob) : null;

  return (
    <>
      {/* Hidden video elements to render streams for canvas capture */}
      <video ref={screenVideoRef} style={{ display: "none" }} autoPlay muted></video>
      <video ref={cameraVideoRef} style={{ display: "none" }} autoPlay muted></video>

      {/* The canvas that composites screen+camera */}
      <canvas ref={canvasRef} style={{ width: "100%", maxWidth: "960px", border: "1px solid #ccc" }} />

      <div style={{ marginTop: 8 }}>
        {status === "idle" && (
          <>
            <label>
              <input
                type="checkbox"
                checked={includeMic}
                onChange={(e) => setIncludeMic(e.target.checked)}
              />
              Include Microphone
            </label>
            <br />
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
            <video src={videoUrl} controls autoPlay loop style={{ width: "100%", maxWidth: 960 }} />
            <br />
            <button onClick={handleUpload}>Upload</button>
            <button onClick={handleReset}>Delete</button>
          </>
        )}

        {error && <div style={{ color: "red" }}>{error}</div>}
      </div>
    </>
  );
}
