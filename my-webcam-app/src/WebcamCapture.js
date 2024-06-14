import React, { useState, useEffect, useRef } from 'react';
import FFmpegWrapper from './FFmpegWrapper'; // Import FFmpegWrapper

const WebcamCapture = ({ rtmpUrl, onStreamReady }) => { // Receive props
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    const getVideoStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(stream);
        videoRef.current.srcObject = stream;
      } catch (error) {
        console.error('Error accessing webcam:', error);
      }
    };

    getVideoStream();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Pass the stream to the parent component
  return (
    <div>
      <video ref={videoRef} autoPlay muted />
      {/* Pass the stream as a prop */}
      <FFmpegWrapper stream={stream} rtmpUrl={rtmpUrl} onStreamReady={onStreamReady} /> 
    </div>
  );
};

export default WebcamCapture;