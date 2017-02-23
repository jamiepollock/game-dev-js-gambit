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
      },
      connectionErrors: []
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

    this.props.socket.on('connect_error', function (error) {
      self.setErrorState('Server unavailable.');
      self.props.socket.close();
    })

    this.props.socket.on('disconnect', function () {
      self.setErrorState( 'Disconnected.');
    });
  }

  setErrorState(errorMessage) {
    this.setState({
      show: {
        welcomeScreen: true,
        game: false
      },
      player: {},
      game: {},
      connectionErrors: [
        { target: 'general', message: errorMessage }
      ]
    });
  }


  render() {
    return (
      <main role="main">
        <WelcomeScreen show={this.state.show.welcomeScreen}
          socket={this.props.socket}
          title={this.state.title} 
          connectionErrors={this.state.connectionErrors} />
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