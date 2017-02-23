import React, { Component } from 'react';
import logo from './logo.svg';
import { Jumbotron, Accordion, Panel, Grid, Row, Button, FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';

class WelcomeScreen extends Component {
    render() {
        if (!this.props.show) {
            return null;
        }
        return (
            <div className="welcome-screen">
                <Header title={this.props.title} />
                <Grid>
                    <Row className="show-grid">
                        <Accordion>
                            <Panel header="Create Game" eventKey="c">
                                <CreateGame socket={this.props.socket} />
                            </Panel>
                            <Panel header="Join Game" eventKey="j">
                                <JoinGame socket={this.props.socket} />
                            </Panel>
                        </Accordion>
                    </Row>
                </Grid>
            </div>
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

class CreateGame extends Component {
    constructor(props) {
        super(props);

        this.state = {
            playerName: ''
        };

        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handlePlayerNameChange = this.handlePlayerNameChange.bind(this);
    };

    handleFormSubmit(e) {
        e.preventDefault();
        this.props.socket.emit('createGame', this.state.playerName);
    }

    handlePlayerNameChange(e) {
        this.setState({ playerName: e.target.value });
    };

    getPlayerNameValidationState() {
        if (this.state.errors) {
            return 'error';
        }
    };

    render() {
        return (
            <div className='create-game'>
                <form onSubmit={this.handleFormSubmit}>
                    <FormGroup
                        controlId="form-playername"
                        validationState={this.getPlayerNameValidationState()}
                    >
                        <ControlLabel>Player Name</ControlLabel>
                        <FormControl
                            type="text"
                            value={this.state.playerName}
                            placeholder="Enter Name"
                            onChange={this.handlePlayerNameChange}
                        />
                        <FormControl.Feedback />
                        <HelpBlock>Your name, visible to other players in the game.</HelpBlock>
                    </FormGroup>
                    <Button type="submit" bsStyle="primary" bsSize="large" block>Create Game</Button>
                </form>
            </div>
        );
    }
}


class JoinGame extends Component {
    constructor(props) {
        super(props);

        this.state = {
            playerName: '',
            gameId: ''
        };

        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handlePlayerNameChange = this.handlePlayerNameChange.bind(this);
        this.handleGameIdChange = this.handleGameIdChange.bind(this);
    };

    handleFormSubmit(e) {
        e.preventDefault();
        //send to socket.io;
    }

    handlePlayerNameChange(e) {
        this.setState({ playerName: e.target.value });
    };
    handleGameIdChange(e) {
        this.setState({ gameId: e.target.value });
    };

    getPlayerNameValidationState() {
        if (this.state.errors) {
            return 'error';
        }
    };
    getGameIdValidationState() {
        if (this.state.errors) {
            return 'error';
        }
    };

    render() {
        return (
            <div className='join-game'>
                <form>
                    <FormGroup
                        controlId="form-playername"
                        validationState={this.getPlayerNameValidationState()}
                    >
                        <ControlLabel>Player Name</ControlLabel>
                        <FormControl
                            type="text"
                            value={this.state.playerName}
                            placeholder="Enter Name"
                            onChange={this.handlePlayerNameChange}
                        />
                        <FormControl.Feedback />
                        <HelpBlock>Your name, visible to other players in the game.</HelpBlock>
                    </FormGroup>

                    <FormGroup
                        controlId="form-gameid"
                        validationState={this.getGameIdValidationState()}
                    >
                        <ControlLabel>Game ID</ControlLabel>
                        <FormControl
                            type="text"
                            value={this.state.gameId}
                            placeholder="Enter Game ID"
                            onChange={this.handleGameIdChange}
                        />
                        <FormControl.Feedback />
                        <HelpBlock>The ID of the game you wish to join.</HelpBlock>
                    </FormGroup>
                    <Button type="submit" bsStyle="primary" bsSize="large" block>Join Game</Button>
                </form>
            </div>
        );
    }
}

export default WelcomeScreen;