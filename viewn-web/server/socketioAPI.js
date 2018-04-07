var io = require('socket.io');

// Design the module to take the 'request-json' client as an argument
module.exports = function(client) {
  // the module to export
  var socketAPI = {};
  // Pause the frequency of update calls to the client endpoint
  let UPDATE_LOCK = false;

  // set one of the functions as 'io()', so './bin/www' can initialize
  // socket.io
  socketAPI.socketServer = io();

  // New connection
  socketAPI.socketServer.on('connection', (webclient) => {
    let data = {
      id: '',
      timestamp: 0,
      length: 0
    }

    // Gets update of current time every 6 seconds
    webclient.on('time-update', (msg) => {
      data = msg;
    });

    // On a seek, immediately update timestamp
    webclient.on('seeked', (msg) => {
      data = msg;
    });

    // Commit timestamp on pause, but rate-limit it
    webclient.on('player-paused', () => {
      updateTimestamp(data, false);
    });

    // Force-commit on a disconnect
    webclient.on('disconnect', () => {
      updateTimestamp(data, true);

      // when client disconnects, kill this socket instance
      webclient.disconnect();
    });
  });


  /*
   * Update the client endpoint with a new timestamp. To prevent
   * flooding, rate-limit how often it can be called (curr. 5 sec).
   */
  function updateTimestamp(data, force) {
    if (!UPDATE_LOCK || force) {
      UPDATE_LOCK = true; // conditional entered, prevent calls

      // Invalid values, remove lock and return
      if (data.id === '' || data.timestamp > data.length) {
        UPDATE_LOCK = false;
        return;
      }

      // If the timestamp is within 10 seconds of the start or end,
      // don't bother saving (that would be annoying). Reset to start.
      if (data.timestamp < 10 || data.length - data.timestamp < 10) {
        data.timestamp = 0;
      }
      // TODO if video is within last ~30? seconds, ignore & update back
      // to start? Only do this on a disconnect? (a 'navigate away' from page)

      client.patch('/videos/' + data.id, { timestamp: data.timestamp },
        (err, result, body) => {

          if (err || result.statusCode === 404) {
            console.error('Socket.io PATCH Error:', err, '- result:', result);
          }
      });

      // wait 5 seconds before allowing another client update
      setTimeout(() => { UPDATE_LOCK = false }, 5000);
    }
  }

  // Return module
  return socketAPI;
};
