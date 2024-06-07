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
// Add checks for other paths if necessary

const nms = new NodeMediaServer(config);
nms.run();
