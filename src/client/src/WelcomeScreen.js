import React, { Component } from 'react';
import logo from './logo.svg';
import { Jumbotron, Accordion, Panel, Grid, Row, Button } from 'react-bootstrap';
import { ErrorMessages, TextField } from './CommonComponents';

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
            playerName: '',
            errors: []
        };

        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handlePlayerNameChange = this.handlePlayerNameChange.bind(this);
    };

    handleFormSubmit(e) {
        e.preventDefault();

        this.setState((prevState, props) => {
            return {
                playerName: prevState.playerName.trim()
            };
        }, function () {
            var submissionErrors = this.getValidationErrors();
            this.attemptSubmit(submissionErrors);
        });
    }
    getValidationErrors() {
        var submissionErrors = [];

        if (this.state.playerName.length === 0) {
            submissionErrors.push({ "target": "playerName", "message": "Player Name is required." });
        }

        return submissionErrors;
    }
    attemptSubmit(submissionErrors) {
        if (submissionErrors.length === 0) {
            this.props.socket.emit('createGame', this.state.playerName);
        } else {
            this.setState({
                errors: submissionErrors
            });
        }
    }

    handlePlayerNameChange(e) {
        this.setState({ playerName: e.target.value });
    };

    render() {
        return (
            <div className='create-game'>
                <form onSubmit={this.handleFormSubmit}>
                    <ErrorMessages errors={this.state.errors} />
                    <TextField controlId="create-game--playerName"
                        label="Player Name"
                        value={this.state.playerName}
                        placeholder="Enter Name"
                        help="Your name, visible to other players in the game."
                        onChange={this.handlePlayerNameChange}
                        errorTargetName="playerName"
                        errors={this.state.errors} />
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
            gameId: '',
            errors: []
        };

        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handlePlayerNameChange = this.handlePlayerNameChange.bind(this);
        this.handleGameIdChange = this.handleGameIdChange.bind(this);
    };

    componentDidMount() {
        var self = this;

        this.props.socket.on('joinGameErrors', function (data) {
            self.setState({
                errors: data.errors
            });
        });
    }

    handleFormSubmit(e) {
        e.preventDefault();

        this.setState((prevState, props) => {
            return {
                playerName: prevState.playerName.trim(),
                gameId: prevState.gameId.trim()
            };
        }, function () {
            var submissionErrors = this.getValidationErrors();
            this.attemptSubmit(submissionErrors);
        });
    }

    getValidationErrors() {
        var submissionErrors = [];

        if (this.state.playerName.length === 0) {
            submissionErrors.push({ "target": "playerName", "message": "Player Name is required." });
        }

        if (this.state.gameId.length === 0) {
            submissionErrors.push({ "target": "gameId", "message": "Game ID is required." });
        }

        return submissionErrors;
    }

    attemptSubmit(submissionErrors) {
        if (submissionErrors.length === 0) {
            var data = {
                gameId: this.state.gameId,
                playerName: this.state.playerName
            }

            this.props.socket.emit('joinGame', data);
        } else {
            this.setState({
                errors: submissionErrors
            });
        }
    }

    handlePlayerNameChange(e) {
        this.setState({ playerName: e.target.value });
    };
    handleGameIdChange(e) {
        this.setState({ gameId: e.target.value });
    };

    render() {
        return (
            <div className='join-game'>
                <form onSubmit={this.handleFormSubmit}>
                    <ErrorMessages errors={this.state.errors} />

                    <TextField controlId="joinGame-playerName"
                        label="Player Name"
                        value={this.state.playerName}
                        placeholder="Enter Name"
                        help="Your name, visible to other players in the game."
                        onChange={this.handlePlayerNameChange}
                        errorTargetName="playerName"
                        errors={this.state.errors} />

                    <TextField controlId="joinGame-gameId"
                        label="Game ID"
                        value={this.state.gameId}
                        placeholder="Enter Game ID"
                        help="The ID of the game you wish to join."
                        onChange={this.handleGameIdChange}
                        errorTargetName="gameId"
                        errors={this.state.errors} />
                    <Button type="submit" bsStyle="primary" bsSize="large" block>Join Game</Button>
                </form>
            </div>
        );
    }
}

export default WelcomeScreen;