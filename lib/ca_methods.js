'use strict';
const caf = require('caf_core');
const caf_comp = caf.caf_components;
const json_rpc = caf.caf_transport.json_rpc;
const myUtils = caf_comp.myUtils;
const app = require('../public/js/app.js');
const APP_SESSION = 'default';
const IOT_SESSION = 'iot';
const LINK_KEY = '__link_key__';
const AUTHORIZED_MAP = 'acl';

const notifyApp = (self, msg) => self.$.session.notify([msg], APP_SESSION);

const notifyIoT = (self, msg) => self.$.session.notify([msg], IOT_SESSION);

exports.methods = {
    // Methods called by framework
    async __ca_init__() {
        this.$.session.limitQueue(1, APP_SESSION); // only the last notification
        this.$.session.limitQueue(1, IOT_SESSION); // only the last notification
        this.state.fullName = this.__ca_getAppName__() + '#' +
            this.__ca_getName__();
        this.state.topics = {};
        this.state.tweets = [];
        this.state.myTweets = [];

        this.$.sharing.addWritableMap('acl', AUTHORIZED_MAP);
        this.$.sharing.addReadOnlyMap(
            'aclAgg', this.$.sharing.fullName(AUTHORIZED_MAP),
            {isAggregate: true, linkKey: LINK_KEY}
        );

        const ruleAgg = this.$.security.newAggregateRule([
           '__ca_handleTweet__'
        ], 'aclAgg');
        this.$.security.addRule(ruleAgg);

        return [];

    },

    async __ca_pulse__() {
        this.$.react.render(app.main, [this.state]);
        return [];
    },

    async __ca_handleTweet__(topic, cmd) {
        if (this.state.topics[topic]) {
            const action = JSON.parse(cmd);
            const method = this[action.cmd];
            const fromCA = this.$.security.getCallerFrom();
            const from = json_rpc.splitName(fromCA)[0];
            this.state.tweets.push({from, msg: action.msg});
            this.state.tweets = this.state.tweets.slice(
                -this.$.props.maxTweets
            );
            notifyApp(self, action.msg);
            return method ? method.apply(this, action.args) : [];
        } else {
            this.$.log && this.$.log.debug(`Missing topic, Ignoring ${cmd}`);
            return [];
        }
    },

    // External methods

    // Start a client session
    async hello(key, tokenStr) {
        tokenStr && this.$.iot.registerToken(tokenStr);
        key && this.$.react.setCacheKey(key);

        // example of delayed configuration
        if (!this.state.meta) {
            return this.configPin(this.$.props.pinNumber);
        } else {
            return this.getState();
        }
    },

    /*
     * @typedef {Object} deltaType
     * @property {Array.<string>=} add
     * @property {Array.<string>=} delete
     *
     */

    /*
     * @param {deltaType|null} principals
     * @param {deltaType|null} links
     */
    async updateACL(principals, links) {
        const toObject = function(arr) {
            const res = {};
            arr.forEach((x) => res[x] = true);
            return res;
        };

        const $$ = this.$.sharing.$;

        const addP = principals && principals.add || [];
        addP.forEach(p => $$.acl.set(p, true));

        const deleteP = principals && principals.delete || [];
        deleteP.forEach(p => $$.acl.delete(p, true));

        const allLinks = toObject($$.acl.get(LINK_KEY) || []);

        const addL = links && links.add || [];
        addL.forEach(l => allLinks[l] = true);

        const deleteL = links && links.delete || [];
        deleteL.forEach(l => delete allLinks[l]);

        $$.acl.set(LINK_KEY, Object.keys(allLinks));

        return this.getState();;
    },

    async subscribe(topic) {
        const fullTopic = this.$.pubsub.FORUM_PREFIX + topic;
        this.$.pubsub.subscribe(fullTopic, '__ca_handleTweet__');
        this.state.topics[fullTopic] = true;
        return this.getState();;
    },

    async unsubscribe(topic) {
        const fullTopic = this.$.pubsub.FORUM_PREFIX + topic;
        if (this.state.topics[fullTopic]) {
            this.$.pubsub.unsubscribe(fullTopic);
            delete this.state.topics[fullTopic];
        }
        return this.getState();;
    },

    async tweet(msg) {
        /* Example:  'buzz #friends #home at NOW+1000 for 340 msec'
         *
         * will buzz for 340 msec, starting in one sec, in all devices
         * subscribed to 'friends' or 'home' topics  (if this CA has permission)
         *
         * or 'buzz #friends NOW for 100'
         *
         * will buzz for 100 msec starting when the request reaches the device.
         *
         * Note that time units are always in msec with a default of 200 msec.
         */
        const msgLower = msg.toLowerCase();
        const isBuzz = !!msgLower.match(/(buzz)/);
        const isNow = !!msgLower.match(/(now)/);
        if (isBuzz & isNow) {
            const mTopics =  msgLower.match(/#(\w+)/g);
            const topics = mTopics && mTopics.map(x => x.slice(1)) || [];
            const mDelay =  msgLower.match(/now\+(\d+)/);
            const delay = mDelay && parseInt(mDelay[1]) || 0;
            const mFor = msgLower.match(/for\W+(\d+)/);
            const duration = mFor && parseInt(mFor[1]) || 200;
            const args = [delay, duration];
            const toPost = JSON.stringify({cmd: 'buzz', args, msg});
            this.state.myTweets.push(msg);
            this.state.myTweets = this.state.myTweets.slice(
                -this.$.props.maxTweets
            );
            topics.forEach((topic) => this.$.pubsub.publish(
                this.$.pubsub.FORUM_PREFIX + topic, toPost
            ));
            return this.getState();
        } else {
            return [new Error(`Invalid tweet ${msg}`)];
        }
    },

    // Configure GPIO pin number for the buzzer
    async configPin(pinNumber) {
        const $$ = this.$.sharing.$;
        const meta = {};
        meta[pinNumber] = {
            input: false,
            initialState: {high: false}
        };
        $$.fromCloud.set('meta', meta);
        this.state.meta = meta;
        return this.getState();
    },

    // Generate sound
    async buzz(delay, duration) {
        const bundle = this.$.iot.newBundle(0);
        bundle.setPin(0, [this.$.props.pinNumber, true])
            .setPin(duration, [this.$.props.pinNumber, false]);
        this.$.iot.sendBundle(bundle, delay ? delay : this.$.iot.NOW_SAFE);
        // force device to reload, reducing latency.
        notifyIoT(self, `BUZZ: NOW+${delay} for ${duration} milliseconds`);
        return this.getState();
    },

    async getState() {
        this.$.react.coin();
        return [null, this.state];
    }
};

caf.init(module);
