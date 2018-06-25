const http = require('http');
const { Http, Https } = require('./pipe');
const { Event } = require('../common');

class ProxyServer extends Event {
    static listen(port, ip) {
        const proxyServer = new ProxyServer();
        proxyServer.listen(port, ip);
        return proxyServer;
    }

    constructor() {
        super();

        this.server = http.createServer();
        this.sessionId = 0;
        this.httpsPipe = Https.pipe(this);
        this.httpPipe = Http.pipe(this);

        this.init();
    }

    init() {
        this.bind(this.httpPipe, Http.Events);
        this.bind(this.httpsPipe, Https.Events);
    }

    listen(port, ip) {
        this.server.listen(port, ip);
    }

    nextSessionId() {
        return ++this.sessionId;
    }

    getServer() {
        return this.server;
    }
}

module.exports = ProxyServer;
