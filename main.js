/*
Broadcast a message to connected users when someone connects or disconnects.
Add support for nicknames.
Don’t send the same message to the user that sent it. Instead, append the message directly as soon as he/she presses enter.
Add “{user} is typing” functionality.
Show who’s online.
Add private messaging.
*/

const utils = require('./js/utils')

const express = require('express');
const cookieParser = require('cookie-parser')
const app = express();
const http = require('http');
const fs = require('fs');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(cookieParser());
app.use('/js', express.static(__dirname + '/js'));
app.use('/css', express.static(__dirname + '/css'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
  // console.log("Cookies :  ", req.cookies);
});

app.get('/setcookie', (req, res) => {
  res.cookie(`Cookie token name`,`encrypted cookie string Value`);
  res.send('Cookie have been saved successfully');
});

app.get('/getcookie', (req, res) => {
  console.log(req.cookies)
  res.send(req.cookies);
});

let locked_boxes = {};
let users_locking = {};

io.on('connection', (socket) => {
  let user_id = socket.id;

  // On connection, load locked information
  let ids_colors = Object.fromEntries(Object.entries(locked_boxes).map(([k, id]) => [k, utils.alphanumeric2Color(id)]));
  io.emit('lock', ids_colors);

  socket.on('lock', id => {
    // Define previously locked box
    let previously_locked_id = undefined;
    if (user_id in users_locking) {
      previously_locked_id = users_locking[user_id];

      // Unlock previous locked box
      delete locked_boxes[users_locking[user_id]];
      delete users_locking[user_id];
    }

    // Check if box is free
    if (!(id in locked_boxes)) {
      // ... and lock it for user
      users_locking[user_id] = id;
      locked_boxes[id] = user_id;
    }

    // Report changes back to the Events
    let ids_colors = Object.fromEntries(Object.entries(locked_boxes).map(([k, id]) => [k, utils.alphanumeric2Color(id)]));
    if (previously_locked_id !== undefined) ids_colors[previously_locked_id] = 'white';
    io.emit('lock', ids_colors);
  });

  socket.on('disconnect', () => {
    // Define previously locked box
    let previously_locked_id = undefined;
    if (user_id in users_locking) {
      previously_locked_id = users_locking[user_id];

      // Unlock previous locked box
      delete locked_boxes[users_locking[user_id]];
      delete users_locking[user_id];

      // Report changes to Events
      io.emit('lock', { [previously_locked_id]: 'white' });
    }
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});