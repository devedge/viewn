import 'plyr/dist/plyr.css'
import Base64 from './base64'
import options from './plyroptions'
import Plyr from 'plyr/dist/plyr.min.js'
import io from 'socket.io-client/dist/socket.io.slim.js'

const SOCKET_ENDPOINT = 'http://viewn.io';
let CURRENT_TIME_SET = false;
let SOCKET_INIT = false;

// Decode the Base64 page data
const pagedata = JSON.parse(Base64.decode(
  window.document.getElementById('pagedata').text
));

// Instantiate the plyr instance
const player = new Plyr('#video-player', options);

// On 'ready', seek to the current timestamp. Doesn't work on iOS.
player.on('ready', seekCurrentTime);

// Only initiate socket.io when the player is started for first time
player.on('playing', socketAndSeekOnPlaying);

// Seeks to the current timestamp, if specified. Only can be
// called once at first page load.
function seekCurrentTime() {
  if (!CURRENT_TIME_SET) {
    CURRENT_TIME_SET = true;
    if (pagedata.timestamp) {
      player.currentTime = pagedata.timestamp;
    }
  }
}

// Initialize socket.io only once on page load. This should be called
// by the '.on('playing')' event handler. It's been seperated from the
// event handler only to remove the event handler after being fired once.
function socketAndSeekOnPlaying() {
  if (!SOCKET_INIT) {
    SOCKET_INIT = true;
    seekCurrentTime();
    initSocketConn();

    // Remove the 'player' event handler for this function.
    player.off('playing', socketAndSeekOnPlaying);
  }
}

// Function to initialize a socket.io connection
function initSocketConn() {
  const socket = io(SOCKET_ENDPOINT);

  // Every time-update event is the same, so wrap it in a function
  function emitSocketUpdate() {
    socket.emit('time-update', {
      id: pagedata.pageid,
      timestamp: player.currentTime,
      length: player.duration
    });
  }

  socket.on('connect', () => {
    // Everytime a seek occurs, update time
    player.on('seeked', () => {
      console.log('Seeked event emitted');
      emitSocketUpdate();
    });

    // Everytime the state becomes 'playing', emit an event
    player.on('playing', () => {
      emitSocketUpdate();
    });

    // On a 'pause', notify server so it will automatically update DB
    player.on('pause', () => {
      socket.emit('player-paused');
    });

    // 'Lock' to slow down the 'timeupdate' events
    let TIME_LOCK = false;

    // Emitted every time there's an update to the time
    player.on('timeupdate', () => {
      if (!TIME_LOCK) {
        TIME_LOCK = true; // lock conditional
        emitSocketUpdate();

        // keep this conditional locked for another 6 seconds
        setTimeout(() => { TIME_LOCK = false }, 6000);
      }
    });
  });

  socket.on('disconnect', () => {
    console.log('Server disconnect, leaving');
    socket.disconnect();
  });
}

// TODO
// only import this if the browser doesn't support hls
// import HLS from 'hls.js/dist/hls.min.js'

// let videoelement = window.document.getElementById('video-player');
//
// if (videoelement) {
//   let mimeType = videoelement.children[0].type;
//   let source = videoelement.children[0].src;
//
//   // Initiate HLS support for non-Safari browsers
//   if ((mimeType === 'application/x-mpegURL') && HLS.isSupported()) {
//     var hls = new HLS();
//     hls.loadSource(source);
//     hls.attachMedia(videoelement);
//     hls.on(HLS.Events.MANIFEST_PARSED,function() {
//       console.log('HLS source loaded, and ready to play');
//     });
//   }
// }
