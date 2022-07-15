/*
Broadcast a message to connected users when someone connects or disconnects.
Add support for nicknames.
Don’t send the same message to the user that sent it. Instead, append the message directly as soon as he/she presses enter.
Add “{user} is typing” functionality.
Show who’s online.
Add private messaging.
*/

const utils = require('./js/utils')
const Locking = require('./js/Locking')

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

let lock = new Locking.Locking();

io.on('connection', (socket) => {
  let user_id = socket.id;

  // On connection, load locked information
  lock.update_locks(io);

  socket.on('lock', id => lock.change(io, user_id, id));
  socket.on('unlock', () => lock.change(io, user_id, ''));
  socket.on('disconnect', () => lock.change(io, user_id, ''));
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});