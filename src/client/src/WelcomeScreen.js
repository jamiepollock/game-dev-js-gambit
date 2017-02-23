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
        //send to socket.io;
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
                        <HelpBlock>Your name, visible to other players in the game room.</HelpBlock>
                    </FormGroup>
                    <Button bsStyle="primary" bsSize="large" block>Create Room</Button>
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
            roomId: ''
        };

        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handlePlayerNameChange = this.handlePlayerNameChange.bind(this);
        this.handleRoomIdChange = this.handleRoomIdChange.bind(this);
    };

    handleFormSubmit(e) {
        e.preventDefault();
        //send to socket.io;
    }

    handlePlayerNameChange(e) {
        this.setState({ playerName: e.target.value });
    };
    handleRoomIdChange(e) {
        this.setState({ roomId: e.target.value });
    };

    getPlayerNameValidationState() {
        if (this.state.errors) {
            return 'error';
        }
    };
    getRoomIdValidationState() {
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
                        <HelpBlock>Your name, visible to other players in the game room.</HelpBlock>
                    </FormGroup>

                    <FormGroup
                        controlId="form-playername"
                        validationState={this.getRoomIdValidationState()}
                    >
                        <ControlLabel>Room ID</ControlLabel>
                        <FormControl
                            type="text"
                            value={this.state.roomId}
                            placeholder="Enter Room ID"
                            onChange={this.handleRoomIdChange}
                        />
                        <FormControl.Feedback />
                        <HelpBlock>The ID of the room you wish to join.</HelpBlock>
                    </FormGroup>
                    <Button bsStyle="primary" bsSize="large" block>Join Room</Button>
                </form>
            </div>
        );
    }
}

export default WelcomeScreen;