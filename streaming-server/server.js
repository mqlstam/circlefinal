const express = require('express');
const { spawn } = require('child_process');
const NodeMediaServer = require('node-media-server');
const config = require('./config');

const app = express();
const port = 8000; // Port for the Node.js server

const nms = new NodeMediaServer(config);
nms.run(); // Start Node Media Server

app.post('/stream', (req, res) => {
  const ffmpegProcess = spawn('ffmpeg', [
    '-re', // Enable real-time mode
    '-f', 'h264', // Input format (assuming H.264)
    '-i', 'pipe:0', // Input from stdin
    '-c:v', 'copy', // Copy video stream without re-encoding
    '-f', 'flv', // Output format
    'rtmp://localhost/live' // Output to RTMP server
  ]);

  req.on('data', (data) => {
    ffmpegProcess.stdin.write(data);
  });

  req.on('end', () => {
    ffmpegProcess.stdin.end();
  });

  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});