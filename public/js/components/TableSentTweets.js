'use strict';

const React = require('react');
const rB = require('react-bootstrap');
const cE = React.createElement;

class TableSentTweets extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const renderRows = function() {
            const tweets = this.props.myTweets || [];
            return tweets.map((t, i) =>
                              cE('tr', {key:10*i},
                                 cE('td', {key:10*i+4}, t.msg)
                                )
                             );
        };

        return cE(rB.Table, {striped: true, responsive: true, bordered: true,
                             condensed: true, hover: true},
                  cE('thead', {key:0},
                     cE('tr', {key:1},
                        cE('th', {key:5}, 'Sent Messages')
                       ),
                     cE('tbody', {key:8}, renderRows())
                    )
                 );
    }
}

module.exports = TableSentTweets;
