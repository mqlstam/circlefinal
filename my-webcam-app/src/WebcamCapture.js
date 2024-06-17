// import React, { useState, useEffect, useRef } from "react";
// import { FFmpeg } from "@ffmpeg/ffmpeg";
// import { toBlobURL } from "@ffmpeg/util";

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
//       const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
//       const ffmpegInstance = new FFmpeg();
//       try {
//         await ffmpegInstance.load({
//           coreURL: await toBlobURL(
//             `${baseURL}/ffmpeg-core.js`,
//             "text/javascript"
//           ),
//           wasmURL: await toBlobURL(
//             `${baseURL}/ffmpeg-core.wasm`,
//             "application/wasm"
//           ),
//         });
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
//       const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
//       setStream(newStream);
//       videoRef.current.srcObject = newStream;

//       if (ffmpeg && newStream) {
//         const mediaRecorder = new MediaRecorder(newStream, { mimeType: "video/webm; codecs=vp9" });
//         mediaRecorderRef.current = mediaRecorder;

//         mediaRecorder.ondataavailable = async (event) => {
//           if (event.data.size > 0) {
//             const arrayBuffer = await event.data.arrayBuffer();
//             const uint8Array = new Uint8Array(arrayBuffer);

//             await ffmpeg.writeFile("input.webm", uint8Array);
//             console.log("File written to FFmpeg FS.");

//             ffmpeg.run(
//               "-re",
//               "-i", "input.webm",
//               "-c:v", "copy",
//               "-f", "flv",
//               rtmpUrl
//             ).then(() => {
//               console.log("FFmpeg stream completed");
//             }).catch(error => {
//               console.error("Error during FFmpeg streaming:", error);
//             });
//           }
//         };

//         mediaRecorder.start(1000); // Capture in chunks of 1 second
//         setIsStreaming(true);
//         console.log("MediaRecorder started.");
//       }
//     } catch (error) {
//       console.error("Error accessing webcam:", error);
//     }
//   };

//   const stopStreaming = () => {
//     if (stream) {
//       stream.getTracks().forEach((track) => track.stop());
//       setStream(null);
//     }

//     if (mediaRecorderRef.current) {
//       mediaRecorderRef.current.stop();
//       mediaRecorderRef.current = null;
//     }

//     setIsStreaming(false);
//     console.log("Streaming stopped.");
//   };

//   useEffect(() => {
//     return () => {
//       if (stream) {
//         console.log("Stopping webcam stream...");
//         stream.getTracks().forEach((track) => track.stop());
//       }
//       if (mediaRecorderRef.current) {
//         console.log("Stopping MediaRecorder...");
//         mediaRecorderRef.current.stop();
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
