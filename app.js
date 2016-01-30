var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(8080);

var beer_state = {"beer": false};

app.get('/trigger', (req, res) => {
  res.sendFile(__dirname + '/trigger.html');
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  // on initial connection, let  them know the state of the keg
  socket.emit('beer_status', beer_state);

  // when the admin changes the state of the keg, let everyone know
  socket.on('beer', function (data) {
    beer_state = data;
    socket.broadcast.emit('beer_status', beer_state);
  });
});
