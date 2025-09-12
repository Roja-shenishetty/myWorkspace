import React, { useState, useEffect } from "react";

// Your credentials
const CLIENT_ID = "749462751340-v9bgtb4f847eef8d72a4r58p4rsj8lsu.apps.googleusercontent.com";
const API_KEY = "AIzaSyC5eA5BxSDq_hsCcEWTo3ZQT5ZOkf8OuEg";
const SCOPES = "https://www.googleapis.com/auth/youtube.upload";
const DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest",
];

// A simple icon component for the buttons
const GoogleIcon = () => (
    <svg className="w-6 h-6 mr-3" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.804 9.196C34.783 5.544 29.683 3 24 3C12.43 3 3 12.43 3 24s9.43 21 21 21s21-9.43 21-21c0-1.542-.146-3.044-.424-4.439z" />
        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039L38.804 9.196C34.783 5.544 29.683 3 24 3C16.318 3 9.656 6.348 6.306 11.691z" />
        <path fill="#4CAF50" d="M24 45c5.683 0 10.783-2.544 14.804-6.804l-6.571-4.819C29.983 36.492 27.201 38 24 38c-5.045 0-9.351-3.108-11.127-7.481l-6.571 4.819C9.656 41.652 16.318 45 24 45z" />
        <path fill="#1976D2" d="M43.611 20.083H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.571 4.819C42.822 35.253 45 30.075 45 24c0-1.542-.146-3.044-.424-4.439z" />
    </svg>
);

function YouTubeUploader() {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [videoFile, setVideoFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [tokenClient, setTokenClient] = useState(null);
    
    // New state to hold the uploaded video's data
    const [uploadedVideoData, setUploadedVideoData] = useState(null);

    useEffect(() => {
        const gapiScript = document.createElement("script");
        gapiScript.src = "https://apis.google.com/js/api.js";
        gapiScript.async = true;
        gapiScript.defer = true;
        gapiScript.onload = gapiLoaded;
        document.body.appendChild(gapiScript);

        const gisScript = document.createElement("script");
        gisScript.src = "https://accounts.google.com/gsi/client";
        gisScript.async = true;
        gisScript.defer = true;
        gisScript.onload = gisLoaded;
        document.body.appendChild(gisScript);

        return () => {
            document.body.removeChild(gapiScript);
            document.body.removeChild(gisScript);
        };
    }, []);

    const gapiLoaded = () => window.gapi.load('client', initializeGapiClient);

    const initializeGapiClient = async () => {
        await window.gapi.client.init({ apiKey: API_KEY, discoveryDocs: DISCOVERY_DOCS });
    };

    const gisLoaded = () => {
        const client = window.google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID,
            scope: SCOPES,
            callback: (tokenResponse) => {
                if (tokenResponse && tokenResponse.access_token) {
                    window.gapi.client.setToken({ access_token: tokenResponse.access_token });
                    setIsSignedIn(true);
                }
            },
        });
        setTokenClient(client);
    };

    const handleSignIn = () => {
        if (tokenClient) tokenClient.requestAccessToken();
    };

    const handleSignOut = () => {
        window.gapi.client.setToken(null);
        setIsSignedIn(false);
        setUploadedVideoData(null); // Clear video data on sign out
    };

    const handleFileChange = (e) => {
        setVideoFile(e.target.files[0]);
        setUploadedVideoData(null); // Clear previous upload when new file is selected
    };

    const uploadVideo = async () => {
        if (!videoFile) return alert("Please select a video file first.");
        setUploading(true);

        try {
            const metadata = {
                snippet: { title: videoFile.name, description: "Uploaded via a modern React App" },
                status: { privacyStatus: "public" },
            };
            const formData = new FormData();
            formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
            formData.append('video', videoFile);

            const response = await fetch('https://www.googleapis.com/upload/youtube/v3/videos?part=snippet,status', {
                method: 'POST',
                headers: { Authorization: `Bearer ${window.gapi.client.getToken().access_token}` },
                body: formData,
            });

        // NEW: Check for non-OK responses to get the error message
        if (!response.ok) {
            const errorData = await response.json();
            // This specifically checks for the quota error message
            if (errorData.error.message.includes("exceeded the number of videos")) {
                throw new Error("You have reached your daily YouTube upload limit. Please try again tomorrow.");
            }
            throw new Error(`Upload failed with status: ${response.status}`);
        }

            const responseData = await response.json();
            
            // --- NEW: Store the uploaded video data ---
            setUploadedVideoData({
                id: responseData.id,
                title: responseData.snippet.title,
            });

            setVideoFile(null); // Clear the file input
        } catch (error) {
            console.error("Upload failed", error);
            alert(`Upload failed: ${error.message}`);
        }
        setUploading(false);
    };

    return (
        <div className="flex items-center justify-center p-5 m-5 bg-gray-100 font-sans">
            <div className="w-full max-w-lg p-8 space-y-8 bg-white rounded-xl shadow-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-800">YouTube Video Uploader</h2>
                    <p className="mt-2 text-gray-500">Sign in to upload your video directly to YouTube.</p>
                </div>

                {!isSignedIn ? (
                    <button onClick={handleSignIn} className="flex items-center justify-center w-full px-4 py-3 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300">
                        <GoogleIcon />
                        Sign in with Google
                    </button>
                ) : (
                    <div className="space-y-6">
                        <div className="text-center">
                            <p className="text-green-600 font-medium">You are signed in!</p>
                            <button onClick={handleSignOut} className="mt-2 text-sm text-gray-500 hover:text-gray-700 hover:underline">Sign out</button>
                        </div>
                        
                        {/* --- NEW: Conditionally render the upload form OR the success message --- */}
                        {!uploadedVideoData ? (
                            <>
                                <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                                    <label htmlFor="video-upload" className="cursor-pointer inline-flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-300">
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M16.88 9.1A4 4 0 0116 17H5a5 5 0 01-1-9.9V7a3 3 0 014.52-2.59A4.98 4.98 0 0117 8c0 .38-.04.74-.12 1.1zM11 11h3l-4 4-4-4h3V9h2v2z"></path></svg>
                                        Choose Video File
                                    </label>
                                    <input id="video-upload" type="file" accept="video/*" className="hidden" onChange={handleFileChange} />
                                    {videoFile && <p className="mt-4 text-sm text-gray-600">Selected: <span className="font-semibold">{videoFile.name}</span></p>}
                                </div>
                                <button onClick={uploadVideo} disabled={!videoFile || uploading} className="w-full px-4 py-3 font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300">
                                    {uploading ? "Uploading..." : "Upload to YouTube"}
                                </button>
                            </>
                        ) : (
                            <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
                                <h3 className="text-xl font-bold text-green-800">Upload Successful!</h3>
                                <p className="mt-2 text-gray-600">Your video, "{uploadedVideoData.title}", is now available.</p>
                                
                                {/* Embedded Video Player */}
                                <div className="aspect-w-16 aspect-h-9 mt-4 rounded-lg overflow-hidden">
                                    <iframe
                                        src={`https://www.youtube.com/embed/${uploadedVideoData.id}`}
                                        title="YouTube video player"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="w-full h-full"
                                    ></iframe>
                                </div>
                                
                                {/* Link to Video */}
                                <a href={`https://www.youtube.com/watch?v=${uploadedVideoData.id}`} target="_blank" rel="noopener noreferrer" className="inline-block mt-4 text-blue-600 hover:underline">
                                    View on YouTube
                                </a>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default YouTubeUploader;