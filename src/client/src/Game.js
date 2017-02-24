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
        return (

            <Grid>
                <Row className="show-grid">
                    <Col xs={12} md={8}>
                        <GameArea game={this.state.game} />
                    </Col>
                    <Col xs={6} md={4}>
                        <PlayerList game={this.state.game} />
                        <ReadyButton socket={this.props.socket}
                            player={this.props.player}
                            game={this.state.game} />
                        <GameAdminTools socket={this.props.socket}
                            player={this.props.player}
                            game={this.state.game} />
                    </Col>
                </Row>
            </Grid>
        );
    }
}

class GameArea extends Component {
    render() {
        return (
            <h2>Game {this.props.game.id}</h2>
        )
    }
}

class PlayerList extends Component {
    render() {
        if (this.props.game.players.length === 0) {
            return null;
        }

        var freeSlots = [];

        for (var i = 0; i < this.props.game.capacity - this.props.game.players.length; i++) {
            freeSlots.push(<ListGroupItem className='playerlist-empty-slot' key={i}><Glyphicon glyph="question-sign" /> <span className="playerlist-empty-slot--handle">Free Slot</span></ListGroupItem>);
        }

        return (
            <div className="playerlist">
                <h2>Players ({this.props.game.players.length} / {this.props.game.capacity})</h2>
                <ListGroup>
                    {this.props.game.players.map((p, index) =>
                        <PlayerListItem key={index} player={p} isAdmin={this.props.game.owner === p.name} gameStarted={this.props.game.started} />
                    )}
                    {freeSlots}
                </ListGroup>
            </div>
        );
    }
}

class PlayerListItem extends Component {
    render() {
        var adminTag = this.props.isAdmin ?
            <span className="pull-right">
                <Glyphicon glyph="star" title="Admin" />
            </span> : null;

        var readyTag = this.props.gameStarted ? null : " (" + (this.props.player.ready ? 'Ready' : 'Not Ready') + ')';

        return (
            <ListGroupItem className="playerlist-slot">
                <span className="playerlist-slot--handle">{this.props.player.name} {readyTag}</span> {adminTag}
            </ListGroupItem>
        );
    }
}

class ReadyButton extends Component {
    constructor(props) {
        super(props);
        this.state = { ready: this.props.player.ready };
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
            playerName: this.props.player.name,
            ready: !this.state.ready
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
        if (this.props.game.owner !== this.props.player.name) {
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

export default Game;