(function () {
    function Game(gameId, capacity) {
        this.players = [];
        this.owner = '';
        this.id = gameId;
        this.capacity = capacity;
        this.started = false;
        this.ended = false;
        this.currentPlayer = {};
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
        },
        startGame: function () {
            this.setStartingPlayer();

            this.started = true;
        },
        endGame: function () {
            this.ended = true;
        },
        setStartingPlayer: function () {
            var min = 0;
            var max = this.players.length;
            var startingPlayer = this.players[Math.floor(Math.random() * (max - min + 1) + min)];

            console.log(startingPlayer);
            if (startingPlayer) {
                this.currentPlayer = startingPlayer.name;
            }
        }
    }

    module.exports = Game;
})();