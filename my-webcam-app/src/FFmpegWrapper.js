// import React, { useState, useEffect, useRef } from "react";
// import { FFmpeg } from "@ffmpeg/ffmpeg";
// import { fetchFile } from "@ffmpeg/util";

// const App = () => {
//   const [stream, setStream] = useState(null);
//   const [ffmpeg, setFFmpeg] = useState(null);
//   const [isStreaming, setIsStreaming] = useState(false);
//   const videoRef = useRef(null);
//   const mediaRecorderRef = useRef(null);

//   const rtmpUrl = "rtmp://localhost/live"; // Your RTMP server URL

//   useEffect(() => {
//     const loadFFmpeg = async () => {
//       console.log("Loading FFmpeg...");
//       const ffmpegInstance = new FFmpeg({ log: true });
//       try {
//         await ffmpegInstance.load();
//         setFFmpeg(ffmpegInstance);
//         console.log("FFmpeg loaded.");
//       } catch (error) {
//         console.error("Error loading FFmpeg:", error);
//       }
//     };

//     loadFFmpeg();
//   }, []);

//   const startStreaming = async () => {
//     try {
//       console.log("Requesting access to webcam...");
//       const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
//       console.log("Webcam access granted.");
//       setStream(newStream);
//       videoRef.current.srcObject = newStream;

//       if (ffmpeg && newStream) {
//         console.log("Setting up MediaRecorder...");
//         const mediaRecorder = new MediaRecorder(newStream, { mimeType: "video/webm; codecs=vp9" });
//         mediaRecorderRef.current = mediaRecorder;

//         mediaRecorder.ondataavailable = async (event) => {
//           if (event.data.size > 0) {
//             console.log("Data available from MediaRecorder:", event.data);
//             const videoBlob = new Blob([event.data], { type: "video/webm" });
//             const videoFile = new File([videoBlob], "input.webm", { type: "video/webm" });
//             await ffmpeg.writeFile("input.webm", await fetchFile(videoFile));
//             console.log("File written to FFmpeg FS.");

//             try {
//               console.log("Starting FFmpeg streaming...");
//               await ffmpeg.exec([
//                 "-re",
//                 "-i", "input.webm",
//                 "-c:v", "copy",
//                 "-f", "flv",
//                 rtmpUrl
//               ]);
//               console.log("FFmpeg stream completed.");
//             } catch (error) {
//               console.error("Error during FFmpeg streaming:", error);
//             }
//           }
//         };

//         mediaRecorder.start(1000); // Capture in chunks of 1 second
//         setIsStreaming(true);
//         console.log("MediaRecorder started.");
//       } else {
//         console.error("FFmpeg or stream is not initialized.");
//       }
//     } catch (error) {
//       console.error("Error accessing webcam:", error);
//     }
//   };

//   const stopStreaming = () => {
//     console.log("Stopping streaming...");
//     if (stream) {
//       stream.getTracks().forEach((track) => track.stop());
//       setStream(null);
//       console.log("Webcam stream stopped.");
//     }

//     if (mediaRecorderRef.current) {
//       mediaRecorderRef.current.stop();
//       mediaRecorderRef.current = null;
//       console.log("MediaRecorder stopped.");
//     }

//     setIsStreaming(false);
//     console.log("Streaming stopped.");
//   };

//   useEffect(() => {
//     return () => {
//       console.log("Cleaning up resources...");
//       if (stream) {
//         stream.getTracks().forEach((track) => track.stop());
//         console.log("Webcam stream stopped.");
//       }
//       if (mediaRecorderRef.current) {
//         mediaRecorderRef.current.stop();
//         console.log("MediaRecorder stopped.");
//       }
//     };
//   }, [stream]);

//   return (
//     <div>
//       <h1>Webcam to RTMP Stream</h1>
//       <video ref={videoRef} autoPlay muted />
//       <button onClick={startStreaming} disabled={isStreaming}>
//         Start Streaming
//       </button>
//       <button onClick={stopStreaming} disabled={!isStreaming}>
//         Stop Streaming
//       </button>
//     </div>
//   );
// };

// export default App;
