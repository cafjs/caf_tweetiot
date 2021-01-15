'use strict';

const React = require('react');
const rB = require('react-bootstrap');
const cE = React.createElement;

class Received extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const renderRows = function() {
            const tweets = this.props.tweets || [];
            return tweets.map((t, i) =>
                              cE('tr', {key:10*i},
                                 cE('td', {key:10*i+1}, t.from),
                                 cE('td', {key:10*i+4}, t.msg)
                                )
                             );
        };

        return cE(rB.Table, {striped: true, responsive: true, bordered: true,
                             condensed: true, hover: true},
                  cE('thead', {key:0},
                     cE('tr', {key:1},
                        cE('th', {key:2}, 'From'),
                        cE('th', {key:5}, 'Message')
                       ),
                     cE('tbody', {key:8}, renderRows())
                    )
                 );
    }
}

module.exports = Received;
