'use strict';

const React = require('react');
const rB = require('react-bootstrap');
const AppActions = require('../actions/AppActions');
const AppStatus = require('./AppStatus');
const DisplayError = require('./DisplayError');
const Groups = require('./Groups');
const Topics = require('./Topics');
const Send = require('./Send');
const Manage = require('./Manage');
const Received = require('./Received');

const cE = React.createElement;

class MyApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.props.ctx.store.getState();
    }

    componentDidMount() {
        if (!this.unsubscribe) {
            this.unsubscribe = this.props.ctx.store
                .subscribe(this._onChange.bind(this));
            this._onChange();
        }
    }

    componentWillUnmount() {
        if (this.unsubscribe) {
            this.unsubscribe();
            this.unsubscribe = null;
        }
    }

    _onChange() {
        if (this.unsubscribe) {
            this.setState(this.props.ctx.store.getState());
        }
    }

    render() {
        return cE('div', {className: 'container-fluid'},
                  cE(DisplayError, {
                      ctx: this.props.ctx,
                      error: this.state.error
                  }),
                  cE(Groups, {
                      ctx: this.props.ctx,
                      isGroups: this.state.isGroups,
                      acl: this.state.acl
                  }),
                  cE(Topics, {
                      ctx: this.props.ctx,
                      isTopics: this.state.isTopics,
                      topics: this.state.topics
                  }),
                  cE(Send, {
                      ctx: this.props.ctx,
                      isSend: this.state.isSend,
                      myTweets: this.state.myTweets
                  }),
                  cE(rB.Panel, null,
                     cE(rB.Panel.Heading, null,
                        cE(rB.Panel.Title, null,
                           cE(rB.Grid, {fluid: true},
                              cE(rB.Row, null,
                                 cE(rB.Col, {sm:1, xs:1},
                                    cE(AppStatus, {
                                        isClosed: this.state.isClosed
                                    })
                                   ),
                                 cE(rB.Col, {
                                     sm: 5,
                                     xs:10,
                                     className: 'text-right'
                                 }, 'Tweet IoT'),
                                 cE(rB.Col, {
                                     sm: 5,
                                     xs:11,
                                     className: 'text-right'
                                 }, this.state.fullName)
                                )
                             )
                          )
                       ),
                     cE(rB.Panel.Body, null,
                        cE(rB.Panel, null,
                           cE(rB.Panel.Heading, null,
                              cE(rB.Panel.Title, null, 'Manage')
                             ),
                           cE(rB.Panel.Body, null,
                              cE(Manage, {
                                  ctx: this.props.ctx,
                                  isGroups: this.state.isGroups,
                                  isTopics: this.state.isTopics,
                                  isSend: this.state.isSend
                              })
                             )
                          ),
                        cE(rB.Panel, null,
                           cE(rB.Panel.Heading, null,
                              cE(rB.Panel.Title, null, 'Received')
                             ),
                           cE(rB.Panel.Body, null,
                              cE(Received, {
                                  ctx: this.props.ctx,
                                  tweets: this.state.tweets,
                                  topics: this.state.topics
                              })
                             )
                          )

                       )
                    )
                 );
    }
};

module.exports = MyApp;
