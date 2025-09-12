import React,{useRef,useState,useEffect} from 'react';

// --- SVG Icon Components for a professional look ---
const RecordIcon = ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM5 10a5 5 0 1110 0 5 5 0 01-10 0z"></path></svg>
);
const StopIcon = ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd"></path></svg>
);
const DownloadIcon = ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
);
const TrashIcon = ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
);


export default function ScreenRecorder({ artifactId, onUpload }) {
    const mediaRecorderRef = useRef(null);
    const timerRef = useRef(null);
    const [status, setStatus] = useState('idle'); // 'idle', 'recording', 'preview'
    const [videoBlob, setVideoBlob] = useState(null);
    const [includeMic, setIncludeMic] = useState(true);
    const [recordTime, setRecordTime] = useState(0);
    const [error, setError] = useState(null);

    useEffect(() => {
        return () => clearInterval(timerRef.current);
    }, []);

    const startRecording = async () => {
        setStatus('recording');
        setError(null);
        setVideoBlob(null);

        try {
            const screenStream = await navigator.mediaDevices.getDisplayMedia({
                video: { cursor: "always" },
                audio: true, // For tab/system audio
            });

            let combinedStream;
            if (includeMic) {
                const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                combinedStream = new MediaStream([
                    ...screenStream.getVideoTracks(),
                    ...micStream.getAudioTracks(),
                ]);
            } else {
                combinedStream = screenStream;
            }

            const recorder = new MediaRecorder(combinedStream, { mimeType: "video/webm" });
            const chunks = [];

            recorder.ondataavailable = (e) => chunks.push(e.data);
            recorder.onstop = () => {
                const blob = new Blob(chunks, { type: "video/webm" });
                setVideoBlob(blob);
                setStatus('preview');
                // Stop all tracks to turn off the screen sharing indicator
                combinedStream.getTracks().forEach(track => track.stop());
            };

            recorder.start();
            mediaRecorderRef.current = recorder;
            setRecordTime(0);
            timerRef.current = setInterval(() => setRecordTime(prev => prev + 1), 1000);
        } catch (err) {
            console.error("Error starting screen capture:", err);
            setError("Could not start recording. Please grant permission and try again.");
            setStatus('idle');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            clearInterval(timerRef.current);
        }
    };

    const handleUpload = async () => {
        if (!videoBlob || !onUpload) return;
        onUpload(videoBlob);
        // Optionally reset after upload
        // setStatus('idle');
        // setVideoBlob(null);
    };
    
    const handleReset = () => {
        setStatus('idle');
        setVideoBlob(null);
        setRecordTime(0);
        setError(null);
    };
    
    const formatTime = (sec) => `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;

    const videoUrl = videoBlob ? URL.createObjectURL(videoBlob) : null;

    return (
        <div className="w-full max-w-2xl p-6 mx-auto bg-white rounded-xl shadow-lg font-sans">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-800">Screen Recorder</h3>
                {status === 'recording' && (
                    <div className="flex items-center space-x-2">
                        <span className="relative flex w-3 h-3">
                            <span className="absolute inline-flex w-full h-full bg-red-400 rounded-full opacity-75 animate-ping"></span>
                            <span className="relative inline-flex w-3 h-3 bg-red-500 rounded-full"></span>
                        </span>
                        <span className="font-mono text-lg font-semibold text-gray-700">{formatTime(recordTime)}</span>
                    </div>
                )}
            </div>

            {error && <div className="p-3 my-4 text-sm text-red-700 bg-red-100 border border-red-200 rounded-lg">{error}</div>}

            {status === 'idle' && (
                <div className="py-8 text-center">
                    <label className="flex items-center justify-center mb-6 space-x-2 text-gray-600">
                        <input
                            type="checkbox"
                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                            checked={includeMic}
                            onChange={(e) => setIncludeMic(e.target.checked)}
                        />
                        <span>Include Microphone Audio</span>
                    </label>
                    <button onClick={startRecording} className="inline-flex items-center px-6 py-3 font-semibold text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                        <RecordIcon className="w-5 h-5 mr-2" />
                        Start Recording
                    </button>
                </div>
            )}

            {status === 'recording' && (
                <div className="py-8 text-center">
                    <p className="mb-6 text-gray-600">Your screen and audio are now being recorded...</p>
                    <button onClick={stopRecording} className="inline-flex items-center px-6 py-3 font-semibold text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors">
                        <StopIcon className="w-5 h-5 mr-2" />
                        Stop Recording
                    </button>
                </div>
            )}

            {status === 'preview' && videoUrl && (
                <div className="py-6">
                    <h4 className="mb-4 text-lg font-semibold text-gray-700">Recording Preview</h4>
                    <video src={videoUrl} controls className="w-full rounded-lg shadow-md" />
                    <div className="flex items-center justify-end mt-6 space-x-4">
                        <button onClick={handleReset} className="inline-flex items-center px-4 py-2 font-semibold text-gray-700 bg-gray-200 border border-transparent rounded-lg hover:bg-gray-300 transition-colors">
                            <TrashIcon className="w-5 h-5 mr-2" />
                            Delete & Restart
                        </button>
                        <a href={videoUrl} download={`recording-${Date.now()}.webm`} className="inline-flex items-center px-4 py-2 font-semibold text-gray-700 bg-gray-200 border border-transparent rounded-lg hover:bg-gray-300 transition-colors">
                           <DownloadIcon className="w-5 h-5 mr-2" />
                           Download
                        </a>
                        {onUpload && (
                            <button onClick={handleUpload} className="inline-flex items-center px-4 py-2 font-semibold text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition-colors">
                                Upload Recording
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}