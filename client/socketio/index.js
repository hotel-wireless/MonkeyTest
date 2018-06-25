const io = require('socket.io-client');
const store = require('../store');
const action = require('../store/action')

const socket = io('http://' + location.host, {
    path: location.pathname + "socket.io"
});

socket.on('action', function (data) {
    store.dispatch(data);
}).on('netcheck', function(data) {
    store.dispatch(action.addNetCheckRecord(data.timestamp, data.record[0], data.record[1]));
});

setInterval(()=>{
    store.dispatch({
        type: "updateViewData"
    });
}, 300);

module.exports = socket;