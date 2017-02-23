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
                        <GameArea gameId={this.props.gameId} />
                    </Col>
                    <Col xs={6} md={4}>
                        <PlayerList socket={this.props.socket} />
                    </Col>
                </Row>
            </Grid>
        );
    }
}

class GameArea extends Component {
    render() {
        return (
            <h2>Game {this.props.gameId}</h2>
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

        return (
            <div className="game-playerlist">
                <h2>Players</h2>
                <ListGroup>
                    {this.state.players.map((p, index) =>
                        <ListGroupItem key={index}><Glyphicon glyph={p.ready ? 'ok' : 'remove'} /> {p.name} ({p.ready ? 'Ready' : 'Not Ready'})</ListGroupItem>
                    )}
                </ListGroup>
            </div>
        );
    }

}

export default Game;