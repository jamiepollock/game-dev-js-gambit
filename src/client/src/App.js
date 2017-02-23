import React, { Component } from 'react';
import WelcomeScreen from './WelcomeScreen';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "Gambit",
      show: {
        welcomeScreen: true,
        game: false
      }
    };
  }


  componentDidMount() {
    var self = this;

    this.props.socket.on('joinedGame', function (data) {
      self.setState({
        show: {
          welcomeScreen: false,
          game: true
        },
        player: data.player,
        gameId: data.gameId
      });
    });
  }


  render() {
    return (
      <main role="main">
        <WelcomeScreen show={this.state.show.welcomeScreen}
          socket={this.props.socket}
          title={this.state.title} />
        <Game show={this.state.show.game}
          socket={this.props.socket}
          title={this.state.title} />
      </main>
    );
  }
}

class Game extends Component {
  render() {
    if (!this.props.show) {
      return null;
    }
    return (
      <div>
        <h2>Game</h2>
      </div>
    );
  }
}

export default App;