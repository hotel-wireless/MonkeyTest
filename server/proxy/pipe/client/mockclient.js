const { parseMessage, Event } = require('../../../common');
const ProxyClient = require('./proxyclient');

class MockClient extends Event {
    static pipe(sessionId, serverReq, serverRes) {
        return new MockClient(sessionId, serverReq, serverRes);
    }

    constructor(sessionId, serverReq, serverRes) {
        super();

        this.sessionId = sessionId;

        this.init(serverReq, serverRes);
    }

    init(serverReq, serverRes) {
        let requestData = Buffer.alloc(0);
        serverReq.on('data', (chunk)=>{
            requestData = Buffer.concat([requestData, chunk]);
        }).on('end', ()=>{
            this._resume(serverReq, serverRes, requestData);
        });
    }

    _resume(serverReq, serverRes, requestData) {
        const mockServerReq = {
            on(type, callback) {
                if(type === 'data') {
                    callback(requestData);
                    requestData = null;
                } else {
                    callback();
                }

                return this;
            },
            method: serverReq.method,
            headers: serverReq.headers,
            host: serverReq.host,
            port: serverReq.port,
            url: serverReq.url,
            connection: {
                remoteAddress: serverReq.connection.remoteAddress
            }
        };

        let proxyClient = ProxyClient.pipe(this.sessionId, mockServerReq, serverRes);
        const self = this;

        proxyClient.on(ProxyClient.Events.ON_CLIENT_RESPONSE, function(){
            self.fireEvent(ProxyClient.Events.ON_CLIENT_RESPONSE, arguments );
        }).on(ProxyClient.Events.ON_CLIENT_RESPONSE_RECEIVE_DATA, function(){
            self.fireEvent(ProxyClient.Events.ON_CLIENT_RESPONSE_RECEIVE_DATA, arguments );
        });
    }
}

module.exports = MockClient;