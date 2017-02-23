(function () {
    function GameServer() {
        this.games = [];
    }

    GameServer.prototype = {
        createGame: function (gameId, player, capacity) {
            var players = [];
            players.push(player);

            this.games[gameId] = {
                players: players,
                owner: player.name,
                capacity: capacity
            };
        },
        generateGameId: function (length, chars) {
            var result = '';
            for (var i = length; i > 0; --i) {
                result += chars[Math.floor(Math.random() * chars.length)];
            }
            return result;
        }
    };

    module.exports = GameServer;
})();