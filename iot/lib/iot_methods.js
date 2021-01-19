'use strict';
const caf_iot = require('caf_iot');
const myUtils = require('caf_iot').caf_components.myUtils;

exports.methods = {
    async __iot_setup__() {
        const meta = this.fromCloud.get('meta');
        this.$.log && this.$.log.debug(JSON.stringify(meta));
        this.$.gpio.setPinConfig(meta || {});
        this.state.meta = meta;
        return [];
    },

    async __iot_loop__() {
        this.$.log && this.$.log.debug('Time offset ' + this.$.cloud.cli
                                       .getEstimatedTimeOffset());

        const meta = this.fromCloud.get('meta');
        if (meta && !myUtils.deepEqual(meta, this.state.meta)) {
            this.$.log && this.$.log.debug(JSON.stringify(meta));
            this.$.gpio.setPinConfig(meta);
            this.state.meta = meta;
        }

        return [];
    },

    async setPin(pin, value) {
        const now = (new Date()).getTime();
        this.$.log && this.$.log.debug(now + ' setPin:' + pin + ' value:' +
                                       value);
        const pins = {};
        pins[pin] = value;
        this.$.gpio.writeMany(pins);
        return [];
    }
};

caf_iot.init(module);
