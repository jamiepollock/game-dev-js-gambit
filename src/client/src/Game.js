import React, { Component } from 'react';
import { Grid, Row, Col, ListGroup, ListGroupItem, Glyphicon } from 'react-bootstrap';



class Game extends Component {
    render() {
        if (!this.props.show) {
            return null;
        }
        return (

            <Grid>
                <Row className="show-grid">
                    <Col xs={12} md={8}>
                        <GameArea game={this.props.game} />
                    </Col>
                    <Col xs={6} md={4}>
                        <PlayerList socket={this.props.socket} game={this.props.game} />
                        <ReadyButton socket={this.props.socket}
                            player={this.props.player}
                            gameId={this.props.game.id} />
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
    constructor(props) {
        super(props);

        this.state = {
            players: []
        };
    }

    componentDidMount() {
        var self = this;
        this.props.socket.on('syncPlayerList', function (data) {
            self.setState({
                players: data
            });
        });
    }


    render() {
        if (this.state.players.length === 0) {
            return null;
        }

        var freeSlots = [];

        for (var i = 0; i < this.props.game.capacity - this.state.players.length; i++) {
            freeSlots.push(<ListGroupItem className='playerlist-empty-slot' key={i}><Glyphicon glyph="question-sign" /> Free Slot</ListGroupItem>);
        }

        return (
            <div className="playerlist">
                <h2>Players</h2>
                <ListGroup>
                    {this.state.players.map((p, index) =>
                        <ListGroupItem key={index}><Glyphicon glyph={p.ready ? 'ok-sign' : 'remove-sign'} /> {p.name} ({p.ready ? 'Ready' : 'Not Ready'})</ListGroupItem>
                    )}                    
                    {freeSlots}
                </ListGroup>
            </div>
        );
    }
}

class ReadyButton extends Component {
    constructor(props) {
        super(props);
        this.state = { ready: this.props.player.ready };
        this.toggleReadyStateHandler = this.toggleReadyState.bind(this);
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
            gameId: this.props.gameId,
            playerName: this.props.player.name,
            ready: !this.state.ready
        };

        this.props.socket.emit('setPlayerReadyState', data);
    };
    render() {
        if (this.props.gameStarted) {
            return (
                <form onSubmit={this.toggleReadyStateHandler}>
                    <button disabled="disabled">Ready</button>
                </form>
            );
        } else {
            return (
                <form onSubmit={this.toggleReadyStateHandler}>
                    <button>{this.state.ready ? "Not Ready..." : "Ready!"}</button>
                </form>
            );
        }
    }
}

export default Game;