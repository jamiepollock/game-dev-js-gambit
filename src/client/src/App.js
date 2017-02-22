import React, { Component } from 'react';
import logo from './logo.svg';
import { Jumbotron, Well, Grid, Row, Col, Button } from 'react-bootstrap';

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

  render() {
    return (
      <main role="main">
        <Header title={this.state.title} />
        <WelcomeScreen show={this.state.show.welcomeScreen} />
        <Game show={this.state.show.game} />
      </main>
    );
  }
}

class Header extends Component {
  render() {
    return (
      <Jumbotron>
        <Grid>
          <Row className="show-grid center">
            <img src={logo} className='App-logo' alt='logo' />
            <h1>{this.props.title}</h1>
          </Row>
        </Grid>
      </Jumbotron>
    );
  }
}

class WelcomeScreen extends Component {
  render() {
    if (!this.props.show) {
      return null;
    }
    return (
      <Grid>
        <Row className="show-grid">
          <Well>
            <Button bsStyle="primary" bsSize="large" block>Create Room</Button>
            <Button bsStyle="primary" bsSize="large" block>Join Room</Button>
          </Well>
        </Row>
      </Grid>
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