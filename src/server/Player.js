(function () {
    function Player(name, clientId) {
        this.name = name;
        this.clientId = clientId;
        this.ready = false;
        this.score = 0;
        this.hand = [];
    }

    module.exports = Player;
})();