const config = {
  logType: 2,
  rtmp: {
    port: 1935,  // No change needed here if internal port remains the same
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
        dashFlags: '[f=dash:window_size=5:extra_window_size=5:format=matroska]',
      },
    ],
  },
  http: {
    port: 8000,  // Ensure this matches the port you have exposed in docker-compose.yml
    allow_origin: '*',
    mediaroot: '/app/media',
    enabled: true,
  },
};

module.exports = config;
