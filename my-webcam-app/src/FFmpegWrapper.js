import React, { useEffect, useState, useRef } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

const FFmpegWrapper = ({ stream, rtmpUrl, onStreamReady }) => {
  const [loaded, setLoaded] = useState(false);
  const ffmpegRef = useRef(new FFmpeg());
  const messageRef = useRef(null);
  const recorderRef = useRef(null);

  const loadFFmpeg = async () => {
    console.log('Loading FFmpeg...');
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
    const ffmpeg = ffmpegRef.current;
    ffmpeg.on('log', ({ message }) => {
      if (messageRef.current) {
        messageRef.current.innerHTML = message;
      }
      console.log('FFmpeg log:', message);
    });
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
    setLoaded(true);
    console.log('FFmpeg loaded.');
  };

  useEffect(() => {
    loadFFmpeg();
  }, []);

  useEffect(() => {
    if (loaded && stream) {
      const startStreaming = async () => {
        console.log('Starting FFmpeg streaming...');
        
        const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp9' });
        
        let ffmpegProcess;
        const processVideoChunk = async (event) => {
          if (event.data.size > 0) {
            console.log('Data available from MediaRecorder:', event.data);
            const videoBlob = new Blob([event.data], { type: 'video/webm' });
            const arrayBuffer = await videoBlob.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);
            
            await ffmpegRef.current.writeFile('input.webm', uint8Array);
            console.log('File written to FFmpeg FS.');

            if (!ffmpegProcess) {
              ffmpegProcess = ffmpegRef.current.exec([
                '-re',
                '-i', 'input.webm',
                '-c:v', 'libx264',
                '-preset', 'veryfast',
                '-f', 'flv',
                rtmpUrl
              ]);
              ffmpegProcess.then(() => {
                console.log('FFmpeg execution completed.');
              }).catch((error) => {
                console.error('Error during FFmpeg processing:', error);
              });
              onStreamReady(rtmpUrl);
            }
          }
        };

        mediaRecorder.ondataavailable = processVideoChunk;

        mediaRecorder.start(1000); // Capture in chunks of 1 second
        recorderRef.current = mediaRecorder;
        console.log('MediaRecorder started.');
      };

      startStreaming();
    } else if (recorderRef.current) {
      recorderRef.current.stop();
      console.log('MediaRecorder stopped.');
      recorderRef.current = null;
    }
  }, [loaded, stream, rtmpUrl]);

  return <p ref={messageRef}></p>;
};

export default FFmpegWrapper;
