'use strict';

const React = require('react');
const rB = require('react-bootstrap');
const cE = React.createElement;
const AppActions = require('../actions/AppActions');
const LINK_KEY = '__link_key__';
const VERSION_KEY = '__ca_version__';

class Groups extends React.Component {

    constructor(props) {
        super(props);
        this.doAddPrincipal = this.doAddPrincipal.bind(this);
        this.doDeletePrincipal = this.doDeletePrincipal.bind(this);
        this.doAddGroup = this.doAddGroup.bind(this);
        this.doDeleteGroup = this.doDeleteGroup.bind(this);

        this.handleGroup = this.handleGroup.bind(this);
        this.handlePrincipal = this.handlePrincipal.bind(this);

        this.doDismissGroups = this.doDismissGroups.bind(this);
    }

    doAddPrincipal(ev) {
        if (this.props.newPrincipal) {
            AppActions.updateACL(this.props.ctx,
                                 {add: [this.props.newPrincipal]}, null);
            AppActions.setLocalState(this.props.ctx, {newPrincipal: ''});
        } else {
            AppActions.setError(this.props.ctx, new Error('Empty principal'));
        }
    }

    doDeletePrincipal(ev) {
        if (this.props.newPrincipal) {
            AppActions.updateACL(this.props.ctx,
                                 {delete: [this.props.newPrincipal]}, null);
            AppActions.setLocalState(this.props.ctx, {newPrincipal: ''});
        } else {
            AppActions.setError(this.props.ctx, new Error('Empty principal'));
        }
    }

    doAddGroup(ev) {
        if (this.props.newGroup) {
            AppActions.updateACL(this.props.ctx, null,
                                 {add: [this.props.newGroup]});
            AppActions.setLocalState(this.props.ctx, {newGroup: ''});
        } else {
            AppActions.setError(this.props.ctx, new Error('Empty group'));
        }
    }

    doDeleteGroup(ev) {
        if (this.props.newGroup) {
            AppActions.updateACL(this.props.ctx, null,
                                 {delete: [this.props.newGroup]});
            AppActions.setLocalState(this.props.ctx, {newGroup: ''});
        } else {
            AppActions.setError(this.props.ctx, new Error('Empty group'));
        }
    }

    doDismissGroups(ev) {
        AppActions.setLocalState(this.props.ctx, {
            newGroup: '',
            newPrincipal: '',
            isGroups: false
        });
    }

    handleGroup(ev) {
        AppActions.setLocalState(this.props.ctx, {
            newGroup: ev.target.value
        });
    }

    handlePrincipal(ev) {
        AppActions.setLocalState(this.props.ctx, {
            newPrincipal: ev.target.value
        });
    }

    render() {
        const acl = this.props.acl || {};
        const currentGroups = acl[LINK_KEY] && JSON.stringify(acl[LINK_KEY]) ||
            '[]';
        const principals = {...acl};
        delete principals[LINK_KEY];
        delete principals[VERSION_KEY];
        const currentPrincipals = JSON.stringify(Object.keys(principals));

        return cE(rB.Modal, {show: !!this.props.isGroups,
                             onHide: this.doDismissGroups,
                             animation: false},
                  cE(rB.Modal.Header, {
                      className : 'bg-warning text-warning',
                      closeButton: true},
                     cE(rB.Modal.Title, null, 'Manage ACLs for ' +
                        this.props.aclMapName)
                    ),
                  cE(rB.ModalBody, null,
                     cE(rB.Form, {horizontal: true},
                        cE(rB.FormGroup, {controlId: 'newPrincipalId'},
                           cE(rB.Col, {sm:3, xs: 12},
                              cE(rB.ControlLabel, null, 'Principal')
                             ),
                           cE(rB.Col, {sm:9, xs: 12},
                              cE(rB.FormControl, {
                                  type: 'text',
                                  value: this.props.newPrincipal,
                                  placeholder: 'foo',
                                  onChange: this.handlePrincipal
                              })
                             )
                          ),
                        cE(rB.FormGroup, {controlId: 'newPrincipal2Id'},
                           cE(rB.Col, {smOffset: 3, sm:3, xs: 12},
                              cE(rB.ButtonGroup, null,
                                 cE(rB.Button, {onClick: this.doAddPrincipal},
                                    'Add'),
                                 cE(rB.Button, {onClick: this.doDeletePrincipal,
                                                bsStyle: 'danger'},
                                    'Delete')
                                )
                             )
                          ),
                        cE(rB.FormGroup, {controlId: 'currentPrincipalsId'},
                           cE(rB.Col, {smOffset: 3, sm:9, xs: 12},
                              cE(rB.FormControl, {
                                  type: 'text',
                                  style: {wordWrap: 'break-word'},
                                  readOnly: true,
                                  value: currentPrincipals
                              })
                             )
                          ),

                        cE(rB.FormGroup, {controlId: 'newGroupId'},
                           cE(rB.Col, {sm:3, xs: 12},
                              cE(rB.ControlLabel, null, 'Group')
                             ),
                           cE(rB.Col, {sm:9, xs: 12},
                              cE(rB.FormControl, {
                                  type: 'text',
                                  value: this.props.newGroup,
                                  placeholder: 'foo-myca-acl',
                                  onChange: this.handleGroup
                              })
                             )
                          ),
                        cE(rB.FormGroup, {controlId: 'newGroup2Id'},
                           cE(rB.Col, {smOffset:3, sm:3, xs: 12},
                              cE(rB.ButtonGroup, null,
                                 cE(rB.Button, {onClick: this.doAddGroup},
                                    'Add'),
                                 cE(rB.Button, {onClick: this.doDeleteGroup,
                                                bsStyle: 'danger'},
                                    'Delete')
                                )
                             )
                          ),
                        cE(rB.FormGroup, {controlId: 'currentGroupsId'},
                           cE(rB.Col, {smOffset:3, sm:9, xs: 12},
                              cE(rB.FormControl, {
                                  type: 'text',
                                  style: {wordWrap: 'break-word'},
                                  readOnly: true,
                                  value: currentGroups
                              })
                             )
                          )
                       )
                    ),
                  cE(rB.Modal.Footer, null,
                     cE(rB.Button, {onClick: this.doDismissGroups}, 'Continue')
                    )
                 );
    }
};

module.exports = Groups;
