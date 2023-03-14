const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

var usernames = [];

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  socket.on('send username', username => {
    socket.username = username;
    usernames.push(socket.username);
    socket.emit('server message', 'currently online: ' + usernames.join(', '));
    socket.broadcast.emit('server message', socket.username + ' joined');
  });

  socket.on('chat message', msg => {
    io.emit('chat message', socket.username + ": " + msg);
  });

  socket.on('disconnect', () => {
    io.emit('server message', socket.username + " left");
    usernames = usernames.filter(e => e !== socket.username);
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});