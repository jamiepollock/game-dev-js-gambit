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
    gameIdCharacters: 'BCDFGHJKMNPQRSTVWXYZ',
    gameSize: 2
};


io.on('connection', function (client) {
    console.log('User %s connected', client.id);

    client.on('createGame', function (playerName) {
        var newGameId = games.generateGameId(defaults.gameIdLength, defaults.gameIdCharacters);
        while (ioRoomExists(newGameId)) {
            newGameId = games.generateGameId(defaults.gameIdLength, defaults.gameIdCharacters);
        }

        client.join(newGameId, function () {
            var game = games.createGame(newGameId, playerName, client.id, defaults.gameSize);

            console.log('Player ' + playerName + ' (' + client.id + ') created game ' + game.id);
            client.emit("joinedGame", game);
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
                game.addPlayer(data.playerName, client.id);

                client.emit("joinedGame", game);
                syncGame(game);
                console.log('Player ' + data.playerName + ' (' + client.id + ') joined game ' + game.id);
            });
        }
    });

    client.on('setPlayerReadyState', function (data) {
        var game = games.getGameById(data.gameId);
        var player = game.getPlayerByClientId(data.playerId);

        player.ready = data.ready;

        var response = {
            ready: data.ready
        };

        client.emit("changePlayerReadyState", response);

        syncGame(game);
    });

    client.on('startGame', function (gameId) {
        var game = games.getGameById(gameId);
        game.startGame();

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