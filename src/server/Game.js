var Player = require("./Player.js");
(function () {
    const cardTypes = [{
        name: `The Artist`,
        id: 'artist',
        quantity: 5
    }, {
        name: `The Butcher`,
        id: 'butcher',
        quantity: 5
    }, {
        name: `The Detective`,
        id: 'detective',
        quantity: 5
    }, {
        name: `The Gift`,
        id: 'gift',
        quantity: 2
    }, {
        name: `The Grim`,
        id: 'grim',
        quantity: 5
    }, {
        name: 'The Lawmaker',
        id: 'lawmaker',
        quantity: 5
    }, {
        name: 'The Lover',
        id: 'lover',
        quantity: 5
    }, {
        name: 'The Musician',
        id: 'musician',
        quantity: 5
    }, {
        name: 'The Traveller',
        id: 'traveller',
        quantity: 5
    }];

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
            this.loadDeck();
            this.shuffleDeck();
            this.setStartingPlayer();
            this.dealToPlayers(6);

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
            var nextPlayerIndex = (currentPlayerIndex + 1) % this.players.length;

            this.currentPlayerId = this.players[nextPlayerIndex].clientId
        },
        loadDeck: function () {
            for (var cardIndex = 0; cardIndex < cardTypes.length; cardIndex++) {
                var card = cardTypes[cardIndex];

                for (var quantityCounter = 0; quantityCounter < card.quantity; quantityCounter++) {
                    this.deck.push({
                        name: card.name,
                        id: card.id
                    });
                }
            }
        },
        shuffleDeck: function () {
            var i = 0;
            var j = 0;
            var temp = null;

            for (var i = this.deck.length - 1; i > 0; i -= 1) {
                j = Math.floor(Math.random() * (i + 1))
                temp = this.deck[i]
                this.deck[i] = this.deck[j]
                this.deck[j] = temp
            }
        },
        dealToPlayers: function (numberOfCardsEach) {
            var currentPlayer = this.getPlayerByClientId(this.currentPlayerId);
            var currentPlayerIndex = this.players.indexOf(currentPlayer);

            var totalCards = (numberOfCardsEach * this.players.length) + currentPlayerIndex;

            for (var cardIndex = currentPlayerIndex; cardIndex < totalCards; cardIndex++) {
                var playerIndex = cardIndex % this.players.length;
                var nextCard = this.deck.shift();

                if (nextCard) {
                    this.players[playerIndex].hand.push(nextCard);
                }
            }
        },
        dealCardsToPlayer: function(numberOfCards, playerId) {
            var player = this.getPlayerByClientId(playerId);

            for (var cardIndex = 0; cardIndex < numberOfCards; cardIndex++) {
                var nextCard = this.deck.shift();

                if (nextCard) {
                    player.hand.push(nextCard);
                }
            }
        } 
    }



    module.exports = Game;
})();