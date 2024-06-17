import React, { useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

const App = () => {
  const [ffmpeg, setFFmpeg] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isRTMPAccessible, setIsRTMPAccessible] = useState(false);
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const rtmpUrl = 'rtmp://localhost:1935/live'; // Ensure this points to the correct RTMP address
  const httpUrl = 'http://localhost:8080/status'; // HTTP interface of your RTMP server

  useEffect(() => {
    const loadFFmpeg = async () => {
      console.log('Loading FFmpeg...');
      const ffmpegInstance = new FFmpeg({ log: true });
      try {
        await ffmpegInstance.load();
        setFFmpeg(ffmpegInstance);
        console.log('FFmpeg loaded.');
      } catch (error) {
        console.error('Error loading FFmpeg:', error);
      }
    };

    loadFFmpeg();
  }, []);

  // useEffect(() => {
  //   const checkRTMPServer = async () => {
  //     try {
  //       const response = await fetch(httpUrl);
  //       if (response.ok) {
  //         const data = await response.json();
  //         if (data.status === 'NodeMediaServer is running') {
  //           setIsRTMPAccessible(true);
  //           console.log('RTMP server is accessible.');
  //         } else {
  //           setIsRTMPAccessible(false);
  //           console.error('RTMP server returned unexpected status:', data.status);
  //         }
  //       } else {
  //         setIsRTMPAccessible(false);
  //         console.error('RTMP server is not accessible. Status:', response.status);
  //       }
  //     } catch (error) {
  //       setIsRTMPAccessible(false);
  //       console.error('Error accessing RTMP server:', error);
  //     }
  //   };

  //   checkRTMPServer();
  // }, [httpUrl]);

  const startStreaming = async () => {
    // if (!isRTMPAccessible) {
    //   console.error('RTMP server is not accessible. Cannot start streaming.');
    //   return;
    // }
  
    const newStream = webcamRef.current.stream;
    if (ffmpeg && newStream) {
      console.log('Setting up MediaRecorder...');
      const options = { mimeType: 'video/webm; codecs=vp8,opus' }; // Ensure codec compatibility or transcode later
      const mediaRecorder = new MediaRecorder(newStream, options);
      mediaRecorderRef.current = mediaRecorder;
  
      let videoChunks = [];
  
      mediaRecorder.ondataavailable = async (event) => {
        if (event.data && event.data.size > 0) {
          videoChunks.push(event.data);
          if (videoChunks.length >= 5) { // Accumulate enough data chunks
            const videoBlob = new Blob(videoChunks, { type: 'video/webm' });
            videoChunks = [];
  
            const videoFile = new File([videoBlob], 'input.webm', { type: 'video/webm' });
            await ffmpeg.writeFile('input.webm', await fetchFile(videoFile));
  
            try {
              console.log('Transcoding and starting FFmpeg streaming...');
              await ffmpeg.exec([
                '-i', 'input.webm',
                '-c:v', 'libx264', '-x264-params', 'keyint=60:min-keyint=60', // Set key frame intervals
                '-c:a', 'aac', '-b:a', '128k', // Transcode audio to AAC
                '-f', 'flv', rtmpUrl
              ]);
              console.log('FFmpeg stream completed.');
            } catch (error) {
              console.error('Error during FFmpeg streaming:', error);
            }
          }
        }
      };
  
      mediaRecorder.onstart = () => console.log('MediaRecorder started');
      mediaRecorder.onstop = () => console.log('MediaRecorder stopped');
      mediaRecorder.onerror = (event) => console.error('MediaRecorder error:', event.error);
  
      mediaRecorder.start(1000); // Capture in chunks of 1 second
      setIsStreaming(true);
    } else {
      console.error('FFmpeg or stream is not initialized.');
    }
  };
  

  const stopStreaming = () => {
    console.log('Stopping streaming...');
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
      console.log('MediaRecorder stopped.');
    }

    setIsStreaming(false);
    console.log('Streaming stopped.');
  };

  useEffect(() => {
    return () => {
      console.log('Cleaning up resources...');
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        console.log('MediaRecorder stopped.');
      }
    };
  }, []);

  return (
    <div>
      <h1>Webcam to RTMP Stream</h1>
      <Webcam ref={webcamRef} audio={false} />
      <button onClick={startStreaming} >
        Start Streaming
      </button>
      <button onClick={stopStreaming} >
        Stop Streaming
      </button>
      { <p>RTMP server is not accessible. Please check your server configuration.</p>}
    </div>
  );
};

export default App;
