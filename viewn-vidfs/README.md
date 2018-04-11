### `viewn-vidfs`
  - Initialized with `express --view pug viewn-vidfs`
  - Run with:
    `DIR=/path/to/video/dir PORT=3001 npm start`
    to specify a custom directory to serve content from port 3001
  - Everything is served statically

#### `ffmpeg`
For better performance, videos can be re-encoded to HLS. To do this with ffmpeg, run:

  `ffmpeg -i <input file> -codec:v libx264 -codec:a aac -hls_time 10 -hls_list_size 0 -f hls -master_pl_name <output filename>Master.m3u8 <output directory>/<output filename>.m3u8`

This command currently only encodes 1 output stream, using the original video quality. It also adheres to Apple guidelines for encoding HLS: `H.264` video codec, `AAC` audio codec, and a 10 second target duration for segments.

