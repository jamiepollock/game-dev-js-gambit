var g = require("./Game.js");

(function () {
    function GamesServer() {
        this.games = [];
    }

    GamesServer.prototype = {
        createGame: function (gameId, player, capacity) {
            var game = new g(gameId, capacity);
            game.setOwner(player.name);
            game.addPlayer(player);

            this.games.push(game);
        },
        joinGame: function (gameId, player) {
            var game = this.getGame(gameId);

            game.addPlayer(player);
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