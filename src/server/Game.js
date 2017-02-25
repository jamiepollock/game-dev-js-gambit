var Player = require("./Player.js");
(function () {
    function Game(gameId, capacity) {
        this.players = [];
        this.owner = '';
        this.id = gameId;
        this.capacity = capacity;
        this.started = false;
        this.ended = false;
        this.currentPlayerId = '';
        this.deck = [];
    }

    Game.prototype = {
        addPlayer: function (playerName, clientId) {
            var newPlayer = new Player(playerName, clientId);

            this.players.push(newPlayer);
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
        getPlayerByClientId: function (clientId) {
            return this.players.find(function (p) { return p.clientId == clientId });
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
            var startingPlayerIndex = Math.floor(Math.random() * (max - min) + min);

            if (startingPlayerIndex > -1) {
                this.currentPlayerId = this.players[startingPlayerIndex].clientId;
            }
        },
        moveToNextPlayer: function () {
            var currentPlayer = this.getPlayerByClientId(this.currentPlayerId);
            var currentPlayerIndex = this.players.indexOf(currentPlayer);

            if (currentPlayerIndex < this.players.length - 1) {
                currentPlayerIndex++;
            } else {
                currentPlayerIndex = 0;
            }
            this.currentPlayerId = this.players[currentPlayerIndex].clientId
        }
    }

    module.exports = Game;
})();