import React, { useState, useEffect, useRef } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";

const App = () => {
  const [stream, setStream] = useState(null);
  const [rtmpUrl] = useState("rtmp://localhost/live"); // Your RTMP server URL
  const [ffmpeg, setFFmpeg] = useState(null);
  const videoRef = useRef(null);
  const processorRef = useRef(null); // Reference to MediaStreamTrackProcessor

  useEffect(() => {
    const loadFFmpeg = async () => {
      const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
      const ffmpegInstance = new FFmpeg();
      await ffmpegInstance.load({
        coreURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.js`,
          "text/javascript"
        ),
        wasmURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.wasm`,
          "application/wasm"
        ),
      });
      setFFmpeg(ffmpegInstance);
    };

    loadFFmpeg();
  }, []);

  const handleStreamReady = (newStream) => {
    setStream(newStream);

    if (ffmpeg && newStream) {
      const videoTracks = newStream.getVideoTracks();
      if (videoTracks.length > 0) {
        const videoTrack = videoTracks[0];

        // Check if MediaStreamTrackProcessor is supported
        if ("MediaStreamTrackProcessor" in window) {
          // Create a MediaStreamTrackProcessor
          // eslint-disable-next-line no-undef
          const processor = new MediaStreamTrackProcessor({
            track: videoTrack,
          });
          processorRef.current = processor; // Store reference

          // Create a WritableStream to pipe data to FFmpeg
          const writableStream = new WritableStream({
            write: (chunk) => {
              // Convert chunk to Uint8Array
              const uint8Array = new Uint8Array(chunk);

              // Write to FFmpeg.wasm input
              ffmpeg
                .writeFile("input.h264", uint8Array)
                .then(() => {
                  // Execute FFmpeg to encode and stream to RTMP
                  ffmpeg
                    .run(
                      "-re", // Enable real-time mode
                      "-i",
                      "input.h264", // Input from FFmpeg.wasm
                      "-c:v",
                      "copy", // Copy video stream without re-encoding
                      "-f",
                      "flv", // Output format
                      rtmpUrl // Output to RTMP server
                    )
                    .then(() => {
                      console.log("FFmpeg stream completed");
                    })
                    .catch((error) => {
                      console.error("Error during FFmpeg streaming:", error);
                    });
                })
                .catch((error) => {
                  console.error("Error writing to FFmpeg.wasm input:", error);
                });
            },
          });

          // Pipe the MediaStreamTrackProcessor to the WritableStream
          processor.readable.pipeTo(writableStream);
        } else {
          console.warn(
            "MediaStreamTrackProcessor is not supported in this browser"
          );
          // Provide an alternative implementation or fallback
        }
      } else {
        console.error("No video tracks found");
      }
    }
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        if (processorRef.current) {
          processorRef.current.terminate(); // Terminate the processor
        }
      }
    };
  }, [stream]);

  return (
    <div>
      <h1>Webcam to RTMP Stream</h1>
      <video ref={videoRef} autoPlay muted />
      <button
        onClick={() =>
          navigator.mediaDevices
            .getUserMedia({ video: true })
            .then(handleStreamReady)
            .catch((error) => console.error("Error accessing webcam:", error))
        }
      >
        Start Streaming
      </button>
      <button
        onClick={() => {
          if (stream) {
            stream.getTracks().forEach((track) => track.stop());
            setStream(null);
          }
        }}
      >
        Stop Streaming
      </button>
    </div>
  );
};

export default App;
