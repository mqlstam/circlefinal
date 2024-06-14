import React, { useState, useRef } from 'react';

const WebcamStream = () => {
  const videoRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const ws = useRef(null);

  const startStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      videoRef.current.srcObject = stream;
      ws.current = new WebSocket('ws://localhost:8080'); // Connect to the WebSocket server

      ws.current.onopen = () => {
        console.log('WebSocket connection established');
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'video/webm; codecs=vp8',
        });

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0 && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(event.data);
          }
        };

        mediaRecorder.start(1000); // Send data every second
      };

      setIsStreaming(true);
    } catch (error) {
      console.error('Error accessing webcam:', error);
    }
  };

  const stopStream = () => {
    if (videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }

    if (ws.current) {
      ws.current.close();
    }

    setIsStreaming(false);
  };

  return (
    <div>
      <video ref={videoRef} autoPlay muted width="640" height="480" />
      <button onClick={isStreaming ? stopStream : startStream}>
        {isStreaming ? 'Stop Stream' : 'Start Stream'}
      </button>
    </div>
  );
};

export default WebcamStream;
