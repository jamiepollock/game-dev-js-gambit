import React, { Component } from 'react';
import { Grid, Row, Col, ListGroup, ListGroupItem, Glyphicon, Button } from 'react-bootstrap';

class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            game: {
                id: '',
                players: []
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
                            gameId={this.state.game.id} />
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
                        <ListGroupItem key={index} className="playerlist-slot"><Glyphicon glyph={p.ready ? 'ok-sign' : 'remove-sign'} /> <span className="playerlist-slot--handle">{p.name} ({p.ready ? 'Ready' : 'Not Ready'})</span></ListGroupItem>
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
            gameId: this.props.gameId,
            playerName: this.props.player.name,
            ready: !this.state.ready
        };

        this.props.socket.emit('setPlayerReadyState', data);
    };
    render() {
        if (this.props.gameStarted) {
            return (
                <form onSubmit={this.toggleReadyState}>
                    <button disabled="disabled">Ready</button>
                </form>
            );
        } else {
            return (
                <form onSubmit={this.toggleReadyState}>
                    <Button type="submit" bsSize="large" bsStyle={this.state.ready ? 'danger' : 'success'} block>{this.state.ready ? "Not Ready..." : "Ready!"}</Button>
                </form>
            );
        }
    }
}

export default Game;