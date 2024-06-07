const fs = require('fs');
const path = require('path');
const NodeMediaServer = require('node-media-server');
const config = require('./config');

const checkFile = (filePath) => {
  try {
    console.log(`Checking file: ${filePath}`);
    fs.accessSync(filePath, fs.constants.R_OK);
    console.log(`${filePath} is readable.`);
  } catch (err) {
    console.error(`${filePath} is not readable:`, err);
  }
};

// Check critical paths
checkFile(config.http.mediaroot);
checkFile(config.trans.ffmpeg);

const nms = new NodeMediaServer(config);

nms.on('prePublish', (id, StreamPath, args) => {
  console.log(`prePublish: Stream ${StreamPath} is about to start (id: ${id}, args: ${JSON.stringify(args)})`);
});

nms.on('postPublish', (id, StreamPath, args) => {
  console.log(`postPublish: Stream ${StreamPath} started (id: ${id}, args: ${JSON.stringify(args)})`);
});

nms.on('donePublish', (id, StreamPath, args) => {
  console.log(`donePublish: Stream ${StreamPath} ended (id: ${id}, args: ${JSON.stringify(args)})`);
});

nms.run();
