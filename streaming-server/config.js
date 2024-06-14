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
    ffmpeg: '/usr/bin/ffmpeg', // Path to FFmpeg in the Docker container
    tasks: [
      {
        app: 'live',
        hls: false,
        dash: true,
        dashFlags: '[f=dash:window_size=5:extra_window_size=5]',
      },
    ],
  },

  http: {
    port: 8000, // Match the exposed port in docker-compose.yml
    allow_origin: '*',
    mediaroot: '/app/media', // Path inside the container
    enabled: true, // Enable if you want to use NodeMediaServer's HTTP server 
  }
};

module.exports = config;
