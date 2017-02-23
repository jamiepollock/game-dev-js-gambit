import React, { Component } from 'react';
import WelcomeScreen from './WelcomeScreen';
import Game from './Game';

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
        game: data.game
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
          title={this.state.title}
          game={this.state.game}
          player={this.state.player} />
      </main>
    );
  }
}

export default App;