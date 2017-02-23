var express = require('express');
var games = require('./GameServer.js');
var app = express();

var gameServer = new games();
var appServer = app.listen(process.env.PORT || 8082, function () {
    var port = appServer.address().port;
    console.log('Server running at port %s', port);
});

var io = require('socket.io')(appServer);

var defaults = {
    gameIdLength: 4,
    gameIdCharacters: 'ABCDEFGHJKMNPQRSTUVWXYZ',
    gameSize: 4
};


io.on('connection', function (client) {
    console.log('User connected');

    client.on('createGame', function (playerName) {
        var newGameId = gameServer.generateGameId(defaults.gameIdLength, defaults.gameIdCharacters);
        while (ioRoomExists(newGameId)) {
            newGameId = gameServer.generateGameId(defaults.gameIdLength, defaults.gameIdCharacters);
        }

        var player = {
            name: playerName,
            ready: false
        };

        client.join(newGameId, function () {
            gameServer.createGame(newGameId, player, defaults.gameSize);

            var data = {
                gameId: newGameId,
                player: player
            };

            console.log('Player ' + player.name + ' created game ' + data.gameId);
            client.emit("joinedGame", data);
        });
    });

    function ioRoomExists(roomId) {
        return io.sockets.adapter.rooms[roomId] !== undefined;
    }
});