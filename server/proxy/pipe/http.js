const { parseMessage, Event } = require('../../common');
const { ProxyClient } = require('./client');

class Http extends Event {
    static pipe(proxyServer) {
        return new Http(proxyServer);
    }

    static get Events() {
        return Object.assign({
            "ON_SERVER_REQUEST": "onServerRequest",
            "ON_CLIENT_CREATE": "onClientCreate"
        }, ProxyClient.Events);
    }

    constructor(proxyServer) {
        super();

        this.proxyServer = proxyServer;

        this.init();
    }

    init() {
        this.proxyServer.getServer().on('request', (serverReq, serverRes) => {
            const sessionId = this.proxyServer.nextSessionId();
            const requestParams = parseMessage(serverReq);

            // proxy server 的 request 事件
            this.fireEvent(Http.Events.ON_SERVER_REQUEST, [sessionId, requestParams]);

            // proxy client 的 create 事件
            let client = this.fireEvent(Http.Events.ON_CLIENT_CREATE, [sessionId, serverReq, serverRes]);
            if(!client) {
                client = ProxyClient.pipe(sessionId, serverReq, serverRes);
            }

            // proxy client 的 其他 事件
            this.bind(client, ProxyClient.Events);
        });
    }
}

module.exports = Http;
