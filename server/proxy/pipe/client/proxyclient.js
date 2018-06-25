const http = require('http');
const { parseMessage, Event } = require('../../../common');
const fs = require('fs');
var parseString = require('xml2js').parseString;

function _clientResToServerRes(serverRes, clientReq, requestParams) {
    const _serverResClose = () => { serverRes.end(); };

    clientReq.on('response', (clientRes) => {
        this.fireEvent(ProxyClient.Events.ON_CLIENT_RESPONSE,
            [this.sessionId, Object.assign({}, requestParams, {statusCode: clientRes.statusCode, size: clientRes.headers['content-length']})]
        );

        for (let header in (clientRes.headers || {})) {
            if (!clientRes.headers.hasOwnProperty(header)) {
                continue;
            }

            serverRes.setHeader(header, clientRes.headers[header]);
        }

        serverRes.statusCode = clientRes.statusCode;
        serverRes.statusMessage = clientRes.statusMessage;

        let responseData = Buffer.alloc(0);
        clientRes.on('data', function (chunk) {
            responseData = Buffer.concat([responseData, chunk]);
            serverRes.write(chunk);
        }).on('end', ()=>{
            const xml = responseData.toString("utf8");
            if(xml.startsWith("<?xml")) {
                parseString(xml, (err, result) => {
                    const data = result['soap:Envelope']['soap:Body'][0]['RequestResponse'][0]['RequestResult'][0];

                    this.fireEvent(ProxyClient.Events.ON_CLIENT_RESPONSE_RECEIVE_DATA,
                        [this.sessionId, { data }]
                    );
                });
            }
        });

        clientRes.on('end', _serverResClose).on('close', _serverResClose).on('error', _serverResClose);
    });
}

function _serverReqToClientReq(clientReq, serverReq, requestParams) {
    const _clientReqClose = () => { clientReq.end(); };

    serverReq.on('data', function (chunk) {
        clientReq.write(chunk);
    });

    serverReq.on('end', _clientReqClose).on('close', _clientReqClose).on('error', _clientReqClose);
}

class ProxyClient extends Event {
    static pipe(sessionId, serverReq, serverRes) {
        return new ProxyClient(sessionId, serverReq, serverRes);
    }

    static get Events() {
        return {
            "ON_CLIENT_RESPONSE":"onClientResponse",
            "ON_SERVER_REQUEST_RECEIVE_DATA": "onServerRequestReceiveData",
            "ON_CLIENT_REQUEST_WRITE_DATA": "onClientRequestWriteData",
            "ON_CLIENT_RESPONSE_RECEIVE_DATA": "onClientResponseReceiveData",
            "ON_SERVER_RESPONSE_WRITE_DATA": "onServerResponseWriteData"
        }
    }

    constructor(sessionId, serverReq, serverRes) {
        super();

        this.sessionId = sessionId;

        this.init(serverReq, serverRes);
    }

    init(serverReq, serverRes) {
        const requestParams = parseMessage(serverReq);
        const clientReq = http.request(Object.assign({}, requestParams, { host: requestParams.hostname }));

        _clientResToServerRes.call(this, serverRes, clientReq, requestParams);
        _serverReqToClientReq.call(this, clientReq, serverReq, requestParams);
    }
}

module.exports = ProxyClient;
