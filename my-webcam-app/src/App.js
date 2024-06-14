// App.js
import React, { useState } from 'react';
import WebcamCapture from './WebcamCapture';
import FFmpegWrapper from './FFmpegWrapper';

const App = () => {
  const [rtmpUrl, setRtmpUrl] = useState('');
  const [streamStarted, setStreamStarted] = useState(false);

  const handleStreamReady = (url) => {
    setStreamStarted(true);
  };

  const handleRtmpUrlChange = (event) => {
    setRtmpUrl(event.target.value);
  };

  return (
    <div>
      <h1>Webcam to RTMP Stream</h1>
      {rtmpUrl && ( 
        <WebcamCapture rtmpUrl={rtmpUrl} onStreamReady={handleStreamReady} />
      )}

      <input 
        type="text" 
        placeholder="Enter RTMP URL" 
        value={rtmpUrl} 
        onChange={handleRtmpUrlChange} 
      />

      {streamStarted && <p>Stream is running!</p>}

      {/* Pass the stream to FFmpegWrapper */}
      <FFmpegWrapper rtmpUrl={rtmpUrl} onStreamReady={handleStreamReady} />
    </div>
  );
};

export default App;