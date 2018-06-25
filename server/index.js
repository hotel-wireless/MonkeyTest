////////// Global Setting
const ip = '0.0.0.0';
const monitorPort = 8889;
const backProxyPort =8888;
const frontProxyPort =8887;

////////// Global UncaughtException Process
process.on('uncaughtException', function(err) {
    console.log('Caught exception: ' + err);
    console.dir(err);
});

/////////// Proxy Server
const ProxyServer = require('./proxy');
const backProxy = ProxyServer.listen(backProxyPort, ip);
console.log(`Back Proxy of Monkey Server was started at ${ip}:${backProxyPort}`);

const frontProxy = ProxyServer.listen(frontProxyPort, ip);
console.log(`Front Proxy of Monkey Server was started at ${ip}:${frontProxyPort}`);

/////////// Express and WebSocket Server
const express = require('./express');
const SocketIO = require('./socketio');

const theSocketIO = new SocketIO();

theSocketIO.attach(express.listen(monitorPort, ip));
theSocketIO.bind(backProxy, 'back');
theSocketIO.bind(frontProxy, 'front');

console.log(`Moniter Server is running on ${ip}:${monitorPort}`);

/////////// Loading Rule
const rule = require('./rule');
rule.backRule(backProxy, theSocketIO);
rule.frontRule(frontProxy, theSocketIO);

console.log('Rules have been loaded');

// backProxy.on('onClientCreate', (sessionId, serverReq, serverRes) => {
//     const { MockClient } = require('./proxy/pipe/client');
//     return MockClient.pipe(sessionId, serverReq, serverRes);
// }).on('onClientResponseReceiveData', (sessionId, frame) => {
//     console.log(sessionId, frame);
//     const action = require('./store/action');
//     theSocketIO.io.emit("action", action.newClientResponseData(sessionId, frame.data));
// });

////////// memory used
function format(bytes) {
    return (bytes/1024/1024).toFixed(2) + "MB";
}

setInterval(()=>{
    const memUsage = process.memoryUsage();
    console.log("rss:"+format(memUsage.rss)+" heapTotal:"+format(memUsage.heapTotal)+" heapUsed:"+format(memUsage.heapUsed));
}, 15000);

const net = require('net');
const server = net.createServer((c) => {
    console.log('client connected');
    c.on('end', () => {
        console.log('client disconnected');
    });
});
server.listen(6397, () => {
    console.log('server bound at port 6397');
});