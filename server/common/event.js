const _ = require('underscore');

class Event {
    constructor() {
        this.eventHandles = {};
    }

    on(event, callback) {
        if (!(event in this.eventHandles)) {
            this.eventHandles[event] = [];
        }

        this.eventHandles[event].push(callback);

        return this;
    }

    fireEvent(event, data) {
        if (!(event in this.eventHandles)) {
            return;
        }

        for (let handle of this.eventHandles[event] || []) {
            let result = handle.apply(null, data);

            if(result) {
                return result;
            }
        }
    }

    bind(target, events) {
        _.each(events, (event) => {
            if(!target.on) {
                return;
            }

            target.on(event, (...data) => {
                return this.fireEvent(event, data);
            });
        });
    }
}

module.exports = Event;