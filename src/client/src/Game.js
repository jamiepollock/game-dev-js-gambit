import React, { Component } from 'react';
import { Grid, Row, Col, ListGroup, ListGroupItem, Glyphicon, Button } from 'react-bootstrap';

class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            game: {
                id: '',
                players: [],
                started: false
            }
        };
    }

    componentDidMount() {
        var self = this;
        this.props.socket.on('syncGame', function (data) {
            self.setState({
                game: data
            });
        });
    }

    render() {
        if (!this.props.show) {
            return null;
        }

        let gameContent = null;

        if (this.state.game.started) {
            gameContent = <GameArea game={this.state.game} socket={this.props.socket} />;
        } else {
            gameContent = <p>Waiting for players</p>;
        }

        return (
            <Grid>
                <Row className="show-grid">
                    <Col xs={12} md={8}>
                        <h2>Game {this.props.game.id}</h2>
                        {gameContent}
                    </Col>
                    <Col xs={6} md={4}>
                        <PlayerList game={this.state.game} />
                        <ReadyButton socket={this.props.socket}
                            game={this.state.game} />
                        <GameAdminTools socket={this.props.socket}
                            game={this.state.game} />
                    </Col>
                </Row>
            </Grid>
        );
    }
}

class GameArea extends Component {
    render() {
        let currentPlayer = this.props.game.players.find((p) => {
            return p.clientId === this.props.game.currentPlayerId;
        });

        if (currentPlayer.clientId === this.props.socket.id) {
            return <PlayerTurn game={this.props.game} currentPlayer={currentPlayer} socket={this.props.socket} />
        }

        return <PlayerWait game={this.props.game} currentPlayer={currentPlayer} />
    }
}

class PlayerList extends Component {
    render() {
        if (this.props.game.players.length === 0) {
            return null;
        }

        var freeSlots = [];

        for (var i = 0; i < this.props.game.capacity - this.props.game.players.length; i++) {
            freeSlots.push(<ListGroupItem className='playerlist-empty-slot' key={i}><span className="playerlist-empty-slot--handle">Free Slot</span> <Glyphicon glyph="question-sign" /></ListGroupItem>);
        }

        return (
            <div className="playerlist">
                <h2>Players ({this.props.game.players.length} / {this.props.game.capacity})</h2>
                <ListGroup>
                    {this.props.game.players.map((p, index) =>
                        <PlayerListItem key={index} player={p} isAdmin={this.props.game.owner === p.clientId} currentPlayerId={this.props.game.currentPlayerId} gameStarted={this.props.game.started} />
                    )}
                    {freeSlots}
                </ListGroup>
            </div>
        );
    }
}

class PlayerListItem extends Component {
    render() {
        var adminTag = this.props.isAdmin ? <Glyphicon glyph="star" title="Admin" /> : null;
        var readyTag = this.props.gameStarted ? null : " (" + (this.props.player.ready ? 'Ready' : 'Not Ready') + ')';
        var score = this.props.gameStarted ? <span className="pull-right">{this.props.player.score}</span> : null;
        var listGroupItemStyle = this.props.gameStarted && this.props.currentPlayerId === this.props.player.clientId ? "info" : null;

        return (
            <ListGroupItem bsStyle={listGroupItemStyle}>
                <span className="playerlist-slot--handle">{this.props.player.name} {adminTag} {readyTag}</span> {score}
            </ListGroupItem>
        );
    }
}

class ReadyButton extends Component {
    constructor(props) {
        super(props);
        this.state = { ready: false };
        this.toggleReadyState = this.toggleReadyState.bind(this);
    }
    componentDidMount() {
        var self = this;

        this.props.socket.on('changePlayerReadyState', function (data) {
            self.setState({
                ready: data.ready
            });
        });
    }

    toggleReadyState(e) {
        e.preventDefault();
        var data = {
            gameId: this.props.game.id,
            ready: !this.state.ready,
            playerId: this.props.socket.id
        };

        this.props.socket.emit('setPlayerReadyState', data);
    };
    render() {
        if (this.props.game.started) {
            return null;
        }
        return (
            <form onSubmit={this.toggleReadyState}>
                <Button type="submit" bsSize="large" bsStyle={this.state.ready ? 'danger' : 'success'} block>{this.state.ready ? "Not Ready..." : "Ready!"}</Button>
            </form>
        );
    }
}

class GameAdminTools extends Component {
    render() {
        if (this.props.game.owner !== this.props.socket.id) {
            return null;
        }

        return (
            <div className="gameadmintools">
                <StartGame socket={this.props.socket} game={this.props.game} />
            </div>
        );
    }
}

class StartGame extends Component {
    constructor(props) {
        super(props);

        this.startGame = this.startGame.bind(this);
    }

    canStartGame() {
        var game = this.props.game;
        var readyPlayers = game.players.filter(function (p) { return p.ready; });

        return readyPlayers.length === game.capacity;
    }


    startGame(e) {
        e.preventDefault();

        this.props.socket.emit('startGame', this.props.game.id);
    }

    render() {
        if (this.props.game.started) {
            return null;
        }

        return (
            <form onSubmit={this.startGame}>
                <Button type="submit" bsSize="large" bsStyle="primary" block disabled={!this.canStartGame()}>Start Game</Button>
            </form>
        );
    }
}

class PlayerTurn extends Component {
    constructor(props) {
        super(props);

        this.completeTurn = this.completeTurn.bind(this);
    }

    completeTurn(e) {
        e.preventDefault();
        var data = {
            gameId: this.props.game.id
        };

        this.props.socket.emit('completeTurn', data);
    }

    render() {
        return (
            <div className="playerturn">
                <h3>Your Turn!</h3>
                <form onSubmit={this.completeTurn}>
                    <Button type="submit" bsStyle="success">Complete Turn</Button>
                </form>
            </div>
        )
    }
}


class PlayerWait extends Component {
    render() {
        if (!this.props.game.currentPlayerId || this.props.game.currentPlayerId.length === 0) {
            return null;
        }
        return (
            <h3>{this.props.currentPlayer.name}'s Turn!</h3>
        )
    }
}
/*
class GameRoll extends Component {
    constructor(props) {
        super(props);

        this.state = { rolled: 0 };

        this.roll = this.roll.bind(this);
    }

    roll(e) {
        e.preventDefault();

        this.props.socket.emit('playerRoll', number);
    }

    render() {
        <div>
            <form onSubmit={this.roll}>
                <Button type="submit">ROLL!</Button>
            </form>

        </div>
    }
}*/

export default Game;