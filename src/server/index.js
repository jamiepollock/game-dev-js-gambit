var express = require('express');
var GamesServer = require('./GamesServer.js');
var app = express();

var games = new GamesServer();
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
        var newGameId = games.generateGameId(defaults.gameIdLength, defaults.gameIdCharacters);
        while (ioRoomExists(newGameId)) {
            newGameId = games.generateGameId(defaults.gameIdLength, defaults.gameIdCharacters);
        }

        var player = {
            name: playerName,
            ready: false
        };

        client.join(newGameId, function () {
            var game = games.createGame(newGameId, player, defaults.gameSize);

            var data = {
                gameId: newGameId,
                player: player
            };

            console.log('Player ' + player.name + ' created game ' + data.gameId);
            client.emit("joinedGame", data);
        });
    });

    client.on('joinGame', function (data) {
        var response = {
            gameId: data.gameId,
            errors: []
        };

        var game = games.getGameById(data.gameId);

        if (game && ioRoomExists(data.gameId)) {
            response.gameId = game.id;

            if (game.isFull()) {
                response.errors.push({
                    target: 'general',
                    message: 'Game is full.'
                });
            } else if (game.getPlayerByName(data.playerName)) {
                response.errors.push({
                    target: 'playerName',
                    message: "Player name already exists this in game."
                });
            }
        } else {
            response.errors.push({
                target: 'gameId',
                message: "Game does not exist."
            });
        }

        if (response.errors.length > 0) {
            client.emit("joinGameErrors", response);
        } else {
            client.join(game.id, function () {
                var player = {
                    name: data.playerName,
                    ready: false
                };
                game.addPlayer(player);
                
                response.player = player;

                client.emit("joinedGame", response);
                console.log('Player ' + player.name + ' joined game ' + response.gameId);
            });
        }
    });

    function ioRoomExists(roomId) {
        return io.sockets.adapter.rooms.hasPropertyInvariantCase(roomId);
    }
});

Object.prototype.hasPropertyInvariantCase = function (propertyName) {
    var targetPropName = propertyName.toLowerCase();
    var obj = this;

    for (var p in obj) {
        if (obj.hasOwnProperty(p) && targetPropName == p.toLowerCase()) {
            return true;
        }
    }

    return false;
};