// my-webcam-app/src/App.js
import React, { useState, useEffect, useRef } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

const App = () => {
  const [stream, setStream] = useState(null);
  const [rtmpUrl] = useState('rtmp://localhost/live'); // Your RTMP server URL
  const [ffmpeg, setFFmpeg] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const loadFFmpeg = async () => {
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
      const ffmpegInstance = new FFmpeg();
      await ffmpegInstance.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });
      setFFmpeg(ffmpegInstance);
    };

    loadFFmpeg();
  }, []);

  useEffect(() => {
    const startStreaming = async () => {
      if (ffmpeg && stream) {
        const videoTrack = stream.getVideoTracks()[0];
        const videoEncoder = new MediaEncoder(videoTrack);
        videoEncoder.configure({
          codec: 'avc1.42E01E', // H.264 encoding
          width: 640, // Adjust as needed
          height: 480 // Adjust as needed
        });

        videoEncoder.on('dataavailable', async (event) => {
          const encodedData = new Uint8Array(event.data);
          await fetch('/stream', {
            method: 'POST',
            body: encodedData,
            headers: { 'Content-Type': 'video/h264' }
          });
        });

        videoEncoder.start();
      }
    };

    if (stream) {
      startStreaming();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [ffmpeg, stream]);

  const handleStreamReady = (newStream) => {
    setStream(newStream);
  };

  return (
    <div>
      <h1>Webcam to RTMP Stream</h1>
      <video ref={videoRef} autoPlay muted />
      <button onClick={() => navigator.mediaDevices.getUserMedia({ video: true })
        .then(handleStreamReady)
        .catch(error => console.error('Error accessing webcam:', error))}>
        Start Streaming
      </button>
      <button onClick={() => {
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
          setStream(null);
        }
      }}>Stop Streaming</button>
    </div>
  );
};

export default App;