var g = require("./Game.js");

(function () {
    function GamesServer() {
        this.games = [];
    }

    GamesServer.prototype = {
        createGame: function (gameId, playerName, clientId, capacity) {
            var game = new g(gameId, capacity);
            game.addPlayer(playerName, clientId);
            game.setOwner(clientId);

            this.games.push(game);

            return game;
        },
        getGameById: function (gameId) {
            return this.games.find(function (g) { return g.id.toLowerCase() === gameId.toLowerCase() });
        },
        generateGameId: function (length, chars) {
            var result = '';
            for (var i = length; i > 0; --i) {
                result += chars[Math.floor(Math.random() * chars.length)];
            }
            return result;
        }
    };

    module.exports = GamesServer;
})();