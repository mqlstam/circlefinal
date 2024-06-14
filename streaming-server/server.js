const fs = require('fs');
const path = require('path');
const NodeMediaServer = require('node-media-server');
const config = require('./config');
const ffmpeg = require('fluent-ffmpeg');
const WebSocket = require('ws');


// --- Helper Function to Check File Accessibility ---
const checkFile = (filePath) => {
  try {
    console.log(`Checking file: ${filePath}`);
    fs.accessSync(filePath, fs.constants.R_OK);
    console.log(`${filePath} is readable.`);
  } catch (err) {
    console.error(`${filePath} is not readable:`, err);
  }
};

// --- Check Critical Paths ---
checkFile(config.http.mediaroot);
checkFile(config.trans.ffmpeg);

// --- Create NodeMediaServer Instance ---
const nms = new NodeMediaServer(config);

// --- Stream Management ---
const activeStreams = new Map(); // Store active FFmpeg processes

// --- WebSocket Server (Used for Receiving Webcam Stream) ---
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('New client (webcam) connected');

  let ffmpegProcess;
  let buffer = Buffer.alloc(0); // Initialize an empty buffer

  ws.on('message', (data) => {
    const incomingBuffer = Buffer.from(data); // Convert ArrayBuffer to Buffer

    // Append the incoming buffer to the ring buffer
    buffer = Buffer.concat([buffer, incomingBuffer]);

    // Push the buffer to FFmpeg
    if (!ffmpegProcess) {
      ffmpegProcess = ffmpeg()
        .input('pipe:0')
        .inputFormat('webm')
        .output('rtmp://localhost/live/webcam')
        .outputOptions(['-c:v copy', '-c:a copy'])
        .on('start', () => {
          console.log('FFmpeg RTMP stream started');
        })
        .on('error', (err) => {
          console.error('FFmpeg error:', err);
        });

      ffmpegProcess.stdin.write(buffer);
      buffer = Buffer.alloc(0); // Clear the buffer
      ffmpegProcess.run();
    } else {
      ffmpegProcess.stdin.write(incomingBuffer);
    }
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    ws.terminate(); // Terminate the WebSocket connection on error
  });

  ws.on('close', () => {
    console.log('Client (webcam) disconnected');
    if (ffmpegProcess) {
      ffmpegProcess.kill(); // Stop FFmpeg when the client disconnects
    }
  });
});

console.log('WebSocket server started on port 8080');

// --- Start NodeMediaServer ---
nms.run();
console.log('NodeMediaServer running...');
