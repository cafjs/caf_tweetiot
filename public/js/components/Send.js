'use strict';

const React = require('react');
const rB = require('react-bootstrap');
const cE = React.createElement;
const AppActions = require('../actions/AppActions');
const TableSentTweets = require('./TableSentTweets');

class Send extends React.Component {

    constructor(props) {
        super(props);
        this.doSend = this.doSend.bind(this);
        this.doDismissSend = this.doDismissSend.bind(this);
        this.handleTweet = this.handleTweet.bind(this);
        this.submit = this.submit.bind(this);
    }

    doSend(ev) {
        if (this.props.newTweet) {
            AppActions.tweet(this.props.ctx, this.props.newTweet);
            AppActions.setLocalState(this.props.ctx, {newTweet: ''});
        } else {
            AppActions.setError(this.props.ctx, new Error('Empty tweet'));
        }
    }

    doDismissSend(ev) {
        AppActions.setLocalState(this.props.ctx, {isSend: false});
        AppActions.setLocalState(this.props.ctx, {newTweet: ''});
    }

    handleTweet(ev) {
        AppActions.setLocalState(this.props.ctx, {
            newTweet: ev.target.value
        });
    }

    submit(ev) {
        if (ev.key === 'Enter') {
            ev.preventDefault();
            this.doSend(ev);
        }
    }

    render() {
        return cE(rB.Modal, {show: !!this.props.isSend,
                             onHide: this.doDismissSend,
                             animation: false},
                  cE(rB.Modal.Header, {
                      className : 'bg-warning text-warning',
                      closeButton: true},
                     cE(rB.Modal.Title, null, 'New Tweet')
                    ),
                  cE(rB.ModalBody, null,
                     cE(rB.Form, {horizontal: true},
                        cE(rB.FormGroup, {controlId: 'newTweetId'},
                           cE(rB.Col, {sm:2, xs: 12},
                              cE(rB.ControlLabel, null, 'Tweet')
                             ),
                           cE(rB.Col, {sm:10, xs: 12},
                              cE(rB.FormControl, {
                                  type: 'text',
                                  style: {wordWrap: 'break-word'},
                                  value: this.props.newTweet,
                                  placeholder: 'buzz #friends NOW+2000 for 100',
                                  onChange: this.handleTweet,
                                  onKeyPress: this.submit
                              })
                             )
                          ),
                        cE(rB.FormGroup, {controlId: 'newTweet2Id'},
                           cE(rB.Col, {smOffset:2, sm:6, xs: 12},
                              cE(rB.Button, {onClick: this.doSend,
                                             bsStyle: 'danger'}, 'Send')
                             )
                          ),
                        cE(rB.FormGroup, {controlId: 'tweetsId'},
                           cE(TableSentTweets, {
                               myTweets: this.props.myTweets
                           })
                          )
                       )
                    ),
                  cE(rB.Modal.Footer, null,
                     cE(rB.Button, {onClick: this.doDismissSend}, 'Continue')
                    )
                 );
    }
};

module.exports = Send;
