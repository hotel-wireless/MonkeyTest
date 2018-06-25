const net = require('net');
const fs = require('fs');
const SerializeUtil = require("./common/SerializeUtil");
const http = require('http');

////////// Global UncaughtException Process
process.on('uncaughtException', function(err) {
    console.log('Caught exception: ' + err);
    console.dir(err);
});

const PORT = 5389;
net.createServer((socket)=>{
    socket.on("data", (data)=>{
        console.log(data);

        const request = SerializeUtil.deCodeRequest(Buffer.from(data));
        console.log(request.head.serviceCode);

        let req = http.request({
            host: "10.2.58.136",
            port: "80",
            method: "POST",
            path: "/nativeapi/mobile",
            headers: {
                "content-type": "application/x-stop"
            }
        });

        req.on('response', (response)=>{
            response.on('data', (chunk)=>{
          //      console.log(chunk.toString("utf-8"));

                socket.write(chunk);
            })
        });

        req.write(data);
        req.end();
    });
}).listen({
    host: "0.0.0.0",
    port: PORT
});

console.log(`listen on ${PORT}`);

// let data = fs.readFileSync("../data/sample1.bin");
// console.log(data);
// console.log(SerializeUtil.deCodeRequest(Buffer.from(data)));
// data = fs.readFileSync("../data/sample2.bin");
// console.log(data);
// console.log(SerializeUtil.deCodeRequest(Buffer.from(data)));
// let req = http.request({
//     host: "10.2.58.136",
//     port: "80",
//     method: "POST",
//     path: "/nativeapi/mobile",
//     headers: {
//         "content-type": "application/x-stop"
//     }
// });
//
// req.on('response', (response)=>{
//     response.on('data', (chunk)=>{
//         console.log(chunk.toString("utf-8"));
//     })
// });
//
// req.write(data);
// req.end();

