import React, { useEffect, useState } from 'react';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const FFmpegWrapper = ({ stream, rtmpUrl, onStreamReady }) => {
const [ffmpeg, setFFmpeg] = useState(null);
const [streamUrl, setStreamUrl] = useState(null);

useEffect(() => {
const loadFFmpeg = async () => {
const ffmpeg = createFFmpeg({ log: true });
await ffmpeg.load();
setFFmpeg(ffmpeg);
};

loadFFmpeg();
}, []);

useEffect(() => {
    if (ffmpeg && stream && rtmpUrl) { // Only start streaming if all are ready
      const startStreaming = async () => {
        // Load FFmpeg's WASM module
        await ffmpeg.load();

        // Configure FFmpeg command
        ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(stream)); // Assuming stream is a Blob
        const command = `-i input.mp4 -c copy -f flv ${rtmpUrl}`;

        // Execute FFmpeg command
        await ffmpeg.run(command);

        onStreamReady(rtmpUrl); // Notify parent component
      };

      startStreaming();
    };
  }, [ffmpeg, stream, rtmpUrl]); // Add rtmpUrl to dependencies

return null; // No UI element for this component
};

export default FFmpegWrapper;