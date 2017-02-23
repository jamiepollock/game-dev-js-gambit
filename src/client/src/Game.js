import React, { Component } from 'react';

class Game extends Component {
    render() {
        if (!this.props.show) {
            return null;
        }
        return (
            <div>
                <h2>Game {this.props.gameId}</h2>
                <PlayerList socket={this.props.socket} />
            </div>
        );
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
            <ul>
                {this.state.players.map((p, index) =>
                    <li key={index}>{p.name} ({p.ready ? 'Ready' : 'Not Ready'})</li>
                )}
            </ul>
        );
    }

}

export default Game;