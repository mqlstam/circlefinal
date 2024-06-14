const express = require('express');
const app = express();
const port = 3001;

// Define a route to provide the RTMP URL
app.get('/rtmp-url', (req, res) => {
  const rtmpUrl = `rtmp://localhost:1935/live`; // Replace with your actual RTMP URL format
  res.json({ rtmpUrl });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});