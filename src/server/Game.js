(function () {
    function Game(gameId, capacity) {
        this.players = [];
        this.owner = '';
        this.id = gameId;
        this.capacity = capacity;
    }

    Game.prototype = {
        addPlayer: function (player) {
            this.players.push(player);
        },
        setOwner: function (playerName) {
            this.owner = playerName;
        },
        removePlayer: function (playerName) {
            this.players = this.players.filter(function (p) { return p.name != playerName });
        },
        getPlayerByName: function (playerName) {
            return this.players.find(function (p) { return p.name.toLowerCase() == playerName.toLowerCase() });
        },
        getPlayers: function () {
            return this.players;
        },
        isFull: function () {
            return this.players.length == this.capacity;
        }
    }

    module.exports = Game;
})();