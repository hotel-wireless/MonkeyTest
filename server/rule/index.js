const { ProxyClient } = require('../proxy/pipe/client');
const requireUncached = require('require-uncached');
const action = require('../store/action');
const store = require("../store");
const _ = require('underscore');

const backRule = function (proxy, socketio) {
    proxy.on('onClientCreate', (sessionId, serverReq, serverRes) => {
        const TIMEOUT = 45000;
        const { backStatus } = store.getState();
        let backRule;
        let customRule;

        try {
            backRule = requireUncached('../data/rule/backRule');
        } catch(e) {
            backRule = requireUncached('./backRule');
        }

        try {
            customRule = requireUncached('../data/rule/customRule');
        } catch(e) {
            customRule = () => true;
        }

        const backRuleResult = backRule(serverReq);
        const customRuleResult = customRule(serverReq);
        const result = backRuleResult && customRuleResult;

        if(backStatus && result) {
            if(_.isString(backRuleResult)) {
                serverRes.end(backRuleResult);
                socketio.io.emit("action", action.newClientResponse(sessionId, serverReq.url, 200, backRuleResult.length, "back", false));
            } else {
                setTimeout(()=>{
                    serverRes.statusCode = 404;
                    serverRes.end();

                    socketio.io.emit("action", action.newClientResponse(sessionId, serverReq.url, 404, 0, "back", true));
                }, TIMEOUT);
            }

            return {};
        }

        return ProxyClient.pipe(sessionId, serverReq, serverRes);
    });
};

const frontRule = function (proxy, socketio) {
    proxy.on('onClientCreate', (sessionId, serverReq, serverRes) => {
        const TIMEOUT = 45000;
        const { frontStatus } = store.getState();

        try {
            var fontRule = requireUncached('../data/rule/frontRule');
        } catch(e) {
            fontRule = requireUncached('./frontRule');
        }

        if(frontStatus && fontRule(serverReq)) {
            setTimeout(()=>{
                serverRes.statusCode = 404;
                serverRes.end();

                socketio.io.emit("action", action.newClientResponse(sessionId, serverReq.url, 404, 0, "front", true));
            }, TIMEOUT);

            return {};
        }

        return ProxyClient.pipe(sessionId, serverReq, serverRes);
    });
};


module.exports = { backRule, frontRule };
