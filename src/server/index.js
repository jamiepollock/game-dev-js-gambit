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
    gameSize: 2
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

            var response = {
                game: game,
                player: player
            };

            console.log('Player ' + player.name + ' created game ' + game.id);
            client.emit("joinedGame", response);
            syncGame(game);
        });
    });

    client.on('joinGame', function (data) {
        var errors = [];

        var game = games.getGameById(data.gameId);

        if (game && ioRoomExists(data.gameId)) {
            if (game.isFull()) {
                errors.push({
                    target: 'general',
                    message: 'Game is full.'
                });
            } else if (game.getPlayerByName(data.playerName)) {
                errors.push({
                    target: 'playerName',
                    message: "Player name already exists this in game."
                });
            }
        } else {
            errors.push({
                target: 'gameId',
                message: "Game does not exist."
            });
        }

        if (errors.length > 0) {
            client.emit("joinGameErrors", errors);
        } else {
            client.join(game.id, function () {
                var player = {
                    name: data.playerName,
                    ready: false
                };
                game.addPlayer(player);

                var response = {
                    player: player,
                    game: game
                };

                client.emit("joinedGame", response);
                syncGame(game);
                console.log('Player ' + player.name + ' joined game ' + game.id);
            });
        }
    });

    client.on('setPlayerReadyState', function (data) {
        var game = games.getGameById(data.gameId);
        var player = game.getPlayerByName(data.playerName);

        player.ready = data.ready;

        var response = {
            ready: data.ready
        };

        client.emit("changePlayerReadyState", response);

        syncGame(game);
    });

    client.on('startGame', function (gameId) {
        var game = games.getGameById(gameId);
        game.started = true;

        syncGame(game);
    });

    function ioRoomExists(roomId) {
        return io.sockets.adapter.rooms.hasPropertyInvariantCase(roomId);
    }
    function syncGame(game) {
        io.in(game.id).emit('syncGame', game);
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