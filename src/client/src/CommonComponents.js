import React, { Component } from 'react';
import { Alert, FormGroup, ControlLabel, FormControl, HelpBlock  } from 'react-bootstrap';

class ErrorMessages extends Component {
    render() {
        if (!this.props.errors || this.props.errors.length === 0) {
            return null;
        }

        return (
            <Alert bsStyle="danger">
                <h4>Uh-oh</h4>
                <ul>
                    {this.props.errors.map((x, index) =>
                        <li key={index}>{x.message}</li>
                    )}
                </ul>
            </Alert >
        );
    }
}

class TextField extends Component {
    constructor(props) {
        super(props);

        this.getValidationState = this.getValidationState.bind(this);
        this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
    }

    handleTextFieldChange(e) {
        this.props.onChange(e);
    }

    getValidationState() {
        return this.getValidStateByErrorTargetName(this.props.errorTargetName);
    }

    getValidStateByErrorTargetName(targetName) {
        var errors = this.props.errors.filter(function (p) { return p.target === targetName });

        if (errors && errors.length > 0) {
            return 'error';
        }
        return undefined;
    }

    render() {
        return (
            <FormGroup
                controlId={this.props.controlId}
                validationState={this.getValidationState()}
            >
                <ControlLabel>{this.props.label}</ControlLabel>
                <FormControl
                    type="text"
                    value={this.props.value}
                    placeholder={this.props.placeholder}
                    onChange={this.handleTextFieldChange}
                />
                <FormControl.Feedback />
                <HelpBlock>{this.props.helpBlock}</HelpBlock>
            </FormGroup>
        );
    }
}

module.exports = { ErrorMessages, TextField };