// const express = require('express');
// const path = require('path');
// const app = express();
// const port = 3001;

// // Serve static files from the React app
// app.use(express.static(path.join(__dirname, 'build')));

// // Define a route to provide the RTMP URL
// app.get('/rtmp-url', (req, res) => {
//   const rtmpUrl = `rtmp://localhost:1935/live`; // Replace with your actual RTMP URL format
//   res.json({ rtmpUrl });
// });

// // The "catchall" handler: for any request that doesn't
// // match one above, send back React's index.html file.
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

// app.listen(port, () => {
//   console.log(`Server listening at http://localhost:${port}`);
// });
