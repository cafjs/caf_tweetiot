'use strict';

const React = require('react');
const rB = require('react-bootstrap');
const cE = React.createElement;
const AppActions = require('../actions/AppActions');

class Manage extends React.Component {

    constructor(props) {
        super(props);
        this.doGroups = this.doGroups.bind(this);
        this.doTopics = this.doTopics.bind(this);
        this.doSend = this.doSend.bind(this);
        this.doChangePin = this.doChangePin.bind(this);
    }


    doGroups() {
        AppActions.setLocalState(this.props.ctx, {isGroups: true});
    }

    doTopics() {
        AppActions.setLocalState(this.props.ctx, {isTopics: true});
    }

    doSend() {
        AppActions.setLocalState(this.props.ctx, {isSend: true});
    }

    doChangePin() {
        AppActions.setLocalState(this.props.ctx, {isChangePin: true});
    }

    render() {
        return cE(rB.ButtonGroup, null,
                  cE(rB.Button,  {
                      onClick: this.doGroups,
                      bsStyle: 'info'
                  }, 'Groups'),
                  cE(rB.Button,  {
                      onClick: this.doTopics,
                      bsStyle: 'primary'
                  }, 'Topics'),
                  cE(rB.Button,  {
                      onClick: this.doChangePin,
                      bsStyle: 'info'
                  }, 'GPIO Pin'),
                  cE(rB.Button,  {
                      onClick: this.doSend,
                      bsStyle: 'danger'
                  }, 'Send')
                 );
    }
}

module.exports = Manage;
