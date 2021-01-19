'use strict';

const React = require('react');
const rB = require('react-bootstrap');
const cE = React.createElement;
const AppActions = require('../actions/AppActions');

class Topics extends React.Component {

    constructor(props) {
        super(props);
        this.doSubscribe = this.doSubscribe.bind(this);
        this.doUnsubscribe = this.doUnsubscribe.bind(this);
        this.doDismissTopics = this.doDismissTopics.bind(this);
        this.handleTopic = this.handleTopic.bind(this);
    }

    doSubscribe(ev) {
        if (this.props.newTopic) {
            AppActions.subscribe(this.props.ctx, this.props.newTopic);
            AppActions.setLocalState(this.props.ctx, {newTopic: ''});
        } else {
            AppActions.setError(this.props.ctx, new Error('Empty topic'));
        }
    }

    doUnsubscribe(ev) {
        if (this.props.newTopic) {
            AppActions.unsubscribe(this.props.ctx, this.props.newTopic);
            AppActions.setLocalState(this.props.ctx, {newTopic: ''});
        } else {
            AppActions.setError(this.props.ctx, new Error('Empty topic'));
        }
    }

    doDismissTopics(ev) {
        AppActions.setLocalState(this.props.ctx, {
            newTopic: '',
            isTopics: false
        });
    }

    handleTopic(ev) {
        AppActions.setLocalState(this.props.ctx, {
            newTopic: ev.target.value
        });
    }

    render() {
        const topics = this.props.topics && Object.keys(this.props.topics) ||
              [];
        // use slice to remove 'forum-'
        const currentTopics = JSON.stringify(topics.map((x) => x.slice(6)));

        return cE(rB.Modal, {show: !!this.props.isTopics,
                             onHide: this.doDismissTopics,
                             animation: false},
                  cE(rB.Modal.Header, {
                      className : 'bg-warning text-warning',
                      closeButton: true},
                     cE(rB.Modal.Title, null, 'Manage Subscriptions')
                    ),
                  cE(rB.ModalBody, null,
                     cE(rB.Form, {horizontal: true},
                        cE(rB.FormGroup, {controlId: 'newTopicId'},
                           cE(rB.Col, {sm:3, xs: 12},
                              cE(rB.ControlLabel, null, 'Topic')
                             ),
                           cE(rB.Col, {sm:6, xs: 12},
                              cE(rB.FormControl, {
                                  type: 'text',
                                  value: this.props.newTopic,
                                  placeholder: 'friends',
                                  onChange: this.handleTopic
                              })
                             )
                          ),
                        cE(rB.FormGroup, {controlId: 'newTopic2Id'},
                           cE(rB.Col, {smOffset:3, sm:6, xs: 12},
                              cE(rB.ButtonGroup, null,
                                 cE(rB.Button, {onClick: this.doSubscribe},
                                    'Subscribe'),
                                 cE(rB.Button, {onClick: this.doUnsubscribe,
                                                bsStyle: 'danger'},
                                    'Unsubscribe')
                                )
                             )
                          ),
                        cE(rB.FormGroup, {controlId: 'currentTopicsId'},
                           cE(rB.Col, {smOffset: 3, sm:9, xs: 12},
                              cE(rB.FormControl, {
                                  type: 'text',
                                  readOnly: true,
                                  value: currentTopics
                              })
                             )
                          )
                       )
                    ),
                  cE(rB.Modal.Footer, null,
                     cE(rB.Button, {onClick: this.doDismissTopics}, 'Continue')
                    )
                 );
    }
};

module.exports = Topics;
