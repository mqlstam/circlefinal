import React, { useState, useRef, useEffect } from 'react';
import RecordRTC, { invokeSaveAsDialog } from 'recordrtc';

const WebcamStream = () => {
  const videoRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const recorderRef = useRef(null);

  const startStream = async () => {
    try {
    const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false,
    });
    videoRef.current.srcObject = stream;
    
    const recorder = new RecordRTC(stream, {
    type: 'video',
    mimeType: 'video/mp4;codecs=avc1.42E01E', // Change this line for H.264
    video: { width: 640, height: 480 },
    timeSlice: 1000, // Record in chunks of 1 second
    ondataavailable: async (blob) => {
    const arrayBuffer = await blob.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    console.log('Sending video data:', uint8Array);
    
    // Send the video data to the RTMP server
    try {
    const response = await fetch('http://localhost:8000/upload', {
    method: 'POST',
    headers: {
    'Content-Type': 'application/octet-stream',
    },
    body: uint8Array,
    });
    console.log('Video frame sent:', response.status);
    } catch (error) {
    console.error('Error sending video frame:', error);
    }
    },
    });

      recorderRef.current = recorder;
      recorder.startRecording();

      setIsStreaming(true);
    } catch (error) {
      console.error('Error accessing webcam:', error);
    }
  };

  const stopStream = () => {
    if (recorderRef.current) {
      recorderRef.current.stopRecording(() => {
        const blob = recorderRef.current.getBlob();
        invokeSaveAsDialog(blob); // Optional: Save the recorded video
      });
      setIsStreaming(false);
    }
    if (videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
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
