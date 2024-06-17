const express = require('express');
const cors = require('cors');
const NodeMediaServer = require('node-media-server');
const config = require('./config');

const nms = new NodeMediaServer(config);

nms.on('prePublish', (id, StreamPath, args) => {
  console.log('[NodeMediaServer] prePublish:', id, StreamPath, args);
});

nms.run();

// Create an Express app to serve an HTTP endpoint
const app = express();
const port = process.env.PORT || 8080;

// Enable CORS for all routes
app.use(cors());

app.get('/status', (req, res) => {
  res.json({ status: 'NodeMediaServer is running' });
});


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});