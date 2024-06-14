import React, { useState } from 'react';
import WebcamCapture from './WebcamCapture';
import FFmpegWrapper from './FFmpegWrapper';

const App = () => {
  const [stream, setStream] = useState(null);
  const [rtmpUrl] = useState('rtmp://localhost/live');

  return (
    <div>
      <h1>Webcam to RTMP Stream</h1>
      <WebcamCapture onStreamReady={setStream} />
      {stream && <FFmpegWrapper stream={stream} rtmpUrl={rtmpUrl} onStreamReady={(url) => console.log(`Streaming to ${url}`)} />}
    </div>
  );
};

export default App;
