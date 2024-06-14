const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const WebSocket = require('ws');
const NodeMediaServer = require('node-media-server');
const config = require('./config');

const app = require('express')();
const port = 8081; // Change this port to avoid conflict with Node Media Server

const nms = new NodeMediaServer(config);
nms.run();

// WebSocket server for receiving webcam stream
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('New client connected');
  let ffmpegProcess;

  ws.on('message', (data) => {
    if (!ffmpegProcess) {
      ffmpegProcess = spawn('ffmpeg', [
        '-i', 'pipe:0', // Input from stdin
        '-c:v', 'copy', // Copy video stream without re-encoding
        '-f', 'flv', 'rtmp://localhost/live/stream' // Output to RTMP server
      ]);

      ffmpegProcess.stdin.on('error', (e) => {
        console.log('FFmpeg stdin error:', e);
      });

      ffmpegProcess.stderr.on('data', (data) => {
        console.log('FFmpeg stderr:', data.toString());
      });
    }

    ffmpegProcess.stdin.write(data);
  });

  ws.on('close', () => {
    if (ffmpegProcess) {
      ffmpegProcess.stdin.end();
      ffmpegProcess.kill('SIGINT');
    }
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
