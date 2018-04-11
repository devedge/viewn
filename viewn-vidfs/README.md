### `viewn-vidfs`
  - Initialized with `express --view pug viewn-vidfs`
  - Run with:
    `DIR=/path/to/video/dir PORT=3001 npm start`
    to specify a custom directory to serve content from port 3001
  - Everything is served statically

### `ffmpeg`
For better performance, videos can be re-encoded to HLS. To do this with ffmpeg, run:

  `ffmpeg -i <input file> -codec:v libx264 -codec:a aac -hls_time 10 -hls_list_size 0 -f hls -master_pl_name <output filename>Master.m3u8 <output directory>/<output filename>.m3u8`

This command currently only encodes 1 output stream, using the original video quality. It also adheres to Apple guidelines for encoding HLS: `H.264` video codec, `AAC` audio codec, and a 10 second target duration for segments. It will later be amended to add multiple bitrate+quality outputs.

Breaking down the command:
  - `ffmpeg -i <input file>`
    - Specify an input file
  - `-codec:v libx264`
    - Encode video using ffmpeg's `H.264` encoder (`libx264`)
  - `-codec:a aac`
    - Encode audio using the `AAC` encoder
  - `-hls_time 10`
    - Set the target duration of each segment as 10 seconds
  - `-hls_list_size 0`
    - A value of `0` generates all segments (default is the last 5 segments)
  - `-f hls`
    - Set the output format as HLS
  - `-master_pl_name <output filename>Master.m3u8`
    - Specify the name of the master playlist. This is the master index file that can point to different quality index files.
  - `<output directory>/<output filename>.m3u8`
    - The output directory, and the name of the current index file
