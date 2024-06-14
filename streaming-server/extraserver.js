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

  
console.log('Spawning ffmpeg process...');
const ffmpegProcess = spawn('ffmpeg', [
'-re', // Enable real-time mode
'-f', 'mpegts', // Input format for H.264 (MPEG Transport Stream)
'-i', 'pipe:0',
'-c:v', 'copy', // Copy the video stream without re-encoding
'-c:a', 'copy', // Copy the audio stream (if any)
'-f', 'flv', // Output format
'rtmp://localhost/live' // Replace with your RTMP URL
]);

ffmpegProcess.stdin.write(req.body);

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
