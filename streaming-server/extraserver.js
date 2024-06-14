const express = require('express');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const cors = require('cors');
const app = express();
const port = 8000;

// Enable CORS for all routes
app.use(cors());

// Use body-parser to handle raw binary data
app.use(bodyParser.raw({ type: 'application/octet-stream', limit: '50mb' }));

app.post('/upload', (req, res) => {
  console.log('Received video frame:', req.body);

  // Check if req.body is a Buffer
  if (!Buffer.isBuffer(req.body)) {
    console.error('Received data is not a Buffer');
    res.status(400).send('Invalid data');
    return;
  }

  console.log('Spawning ffmpeg process...');
  const ffmpegProcess = spawn('ffmpeg', [
    '-re',
    '-f', 'webm',
    '-i', 'pipe:0',
    '-c:v', 'libx264', // Use libx264 for H.264 encoding
    '-preset', 'ultrafast', // Optional: Use a faster encoding preset
    '-f', 'matroska', // Use Matroska container format
    'rtmp://localhost/live/webcam'
  ]);
  
  ffmpegProcess.stdin.write(req.body);
  ffmpegProcess.stdin.end();

  ffmpegProcess.stderr.on('data', (data) => {
    console.error(`ffmpeg stderr: ${data}`);
  });

  ffmpegProcess.on('close', (code) => {
    if (code !== 0) {
      console.error(`ffmpeg process closed with code ${code}`);
    } else {
      console.log('ffmpeg process closed successfully');
    }
  });

  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
