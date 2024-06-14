const config = {
  logType: 2, // Adjust logging level as needed
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60,
  },
  trans: {
    ffmpeg: '/usr/bin/ffmpeg',
    tasks: [
      {
        app: 'live',
        hls: false,
        dash: true,
        dashFlags: '[f=dash:window_size=5:extra_window_size=5:format=matroska]', // Use Matroska format for DASH
      },
    ],
  },
  http: {
    port: 8000,
    allow_origin: '*',
    mediaroot: '/app/media',
    enabled: true, // Enable if you want to use NodeMediaServer's HTTP server
  }
};

module.exports = config;
