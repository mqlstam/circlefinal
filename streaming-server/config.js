const config = {
  logType: 2,
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60
  },
  http: {
    port: 8000,
    allow_origin: '*',
    mediaroot: '/app/media'
  },
  trans: {
    ffmpeg: '/usr/bin/ffmpeg',
    tasks: [
      {
        app: 'live',
        hls: false,  // Disable HLS if not needed
        dash: true,  // Enable DASH
        dashFlags: '[f=dash:window_size=5:extra_window_size=5]',

        // Optionally enable HLS as well
        // hls: true,
        // hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
      }
    ]
  }
};

module.exports = config;
