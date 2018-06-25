const { parseMessage, Event } = require('../../common');
const net = require('net');

class Https extends Event {
    static pipe(proxyServer) {
        return new Https(proxyServer);
    }

    static get Events() {
        return {
            "ON_SERVER_CONNECT": "onServerConnect",
            "ON_CLIENT_CONNECT": "onClientConnect"
        }
    }

    constructor(proxyServer) {
        super();

        this.proxyServer = proxyServer;

        this.init();
    }

    init() {
        this.proxyServer.getServer().on('connect', (serverReq, socket) => {
            const requestParams = parseMessage(serverReq);
            const client = new net.Socket();
            const sessionId = this.proxyServer.nextSessionId();

            this.fireEvent(Https.Events.ON_SERVER_CONNECT, [sessionId, requestParams]);

            client.connect(requestParams.port, requestParams.hostname).on('connect', () => {
                socket.write('HTTP/1.0 200 Connection Established\r\n\r\n');
                client.pipe(socket);

                this.fireEvent(Https.Events.ON_CLIENT_CONNECT, [sessionId, requestParams]);
            });

            socket.pipe(client);

            socket.on('error', function(){
                client.end();
            }).on('end', function(){
                client.end();
            });

            client.on('error', function(){
                socket.end();
            }).on('end', function(){
                socket.end();
            });
        })
    }
}

module.exports = Https;
