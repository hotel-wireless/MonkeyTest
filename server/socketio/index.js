const Socket = require('socket.io');
const action = require('../store/action');
const store = require("../store");

class SocketIO {
    constructor() {
        this.io = Socket();
        this.socketList = [];
        this.init();
    }

    init() {
        this.io.on('connection', (socket)=>{
            if(this.socketList.indexOf(socket) < 0) {
                this.socketList.push(socket);
            }

            console.log('a client has been connected... ' + this.socketList.length);

            socket.on('action', (data)=>{
                store.dispatch(data);
            }).on('netcheck', (data)=>{
                this.socketList.forEach(s => {
                    s.emit('netcheck', data);
                });
            }).on('disconnect', ()=>{
                let index = this.socketList.indexOf(socket);
                if(index >= 0) {
                    this.socketList.splice(index, 1);
                }
                console.log('a client has been disconnected... ' + this.socketList.length);
            });

            store.subscribe(()=>{
                this.syncServerStatus(socket);
            });

            this.syncServerStatus(socket);
        });
    }

    syncServerStatus(socket) {
        const state = store.getState();
        socket.emit("action", {type: state.frontStatus ? "FRONT_FUSE_ON" : "FRONT_FUSE_OFF"});
        socket.emit("action", {type: state.backStatus ? "BACK_FUSE_ON" : "BACK_FUSE_OFF"});
    }

    attach(webServer) {
        this.io.attach(webServer);
    }

    bind(proxyServer, proxyType) {
        proxyServer.on('onServerRequest', (sessionId, {host, port, method, headers, path, href, remoteAddress})=>{
            this.io.emit("action", action.newServerRequest(sessionId, href, remoteAddress, proxyType, headers["servicecode"]));
        }).on("onClientResponse", (sessionId, {host, port, method, headers, path, href, statusCode, size}) => {
            this.io.emit("action", action.newClientResponse(sessionId, href, statusCode, size, proxyType));
        }).on("onServerConnect", (sessionId, {host, port, method, headers, path, href, statusCode, size, remoteAddress}) => {
            this.io.emit("action", action.newServerRequest(sessionId, href, remoteAddress, proxyType));
        }).on("onClientConnect", (sessionId, {host, port, method, headers, path, href, statusCode, size}) => {
            this.io.emit("action", action.newClientResponse(sessionId, href, statusCode, size, proxyType));
        });
    }
}

module.exports = SocketIO;
