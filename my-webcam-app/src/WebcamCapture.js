import React, { useEffect, useRef, useState } from 'react';

const WebcamCapture = ({ onStreamReady }) => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    const getVideoStream = async () => {
      try {
        console.log('Requesting webcam access...');
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        setStream(stream);
        console.log('Webcam stream obtained:', stream);
      } catch (error) {
        console.error('Error accessing webcam:', error);
      }
    };

    getVideoStream();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        console.log('Webcam stream stopped.');
      }
    };
  }, []);

  const startStreaming = () => {
    console.log('Starting webcam streaming...');
    onStreamReady(stream);
  };

  const stopStreaming = () => {
    console.log('Stopping webcam streaming...');
    onStreamReady(null);
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setStream(null);
  };

  return (
    <div>
      <video ref={videoRef} autoPlay muted />
      <button onClick={startStreaming}>Start Streaming</button>
      <button onClick={stopStreaming}>Stop Streaming</button>
    </div>
  );
};

export default WebcamCapture;
