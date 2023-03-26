const fs = require('fs');
const path = require('path');
const http = require('http');
const cors = require('cors');
const express = require('express');
const workerManager = require('./js/workerManager');
const app = express();
const server = http.createServer(app);

// IMPORT ROUTERS
const router = {
    chiness : require("./routes/chinese"),
    worker : require("./routes/worker")(workerManager.gatherWorkerList('../worker').workerList),
    else : require("./routes/else")
}

// USE ROUTERS
app.use(cors());
app.use(router.chiness);
app.use(router.worker);
app.use('/static', express.static(path.join(__dirname, 'build/static')));
app.use(express.static(path.join(__dirname, 'build')));
app.use('/*', router.else);

/* IPC CONNECT AND SOCKET.IO */
const ipc = require('node-ipc');
ipc.config.id = 'listener';
ipc.config.retry = 1500;
ipc.config.silent = true;

const socketIO = require('socket.io');
const io = socketIO(server, {pingTimeout: 60000});

ipc.serve(() => {
    // add to workerlist
    workerManager.workerList.forEach((workerName) => {
        ipc.server.on(workerName, pushToClientSocket(workerName))
    });
});
// when establish socket, send initial data
io.sockets.on("connection", socket => {
    socket.on(`request_data_from_client`, workerName => {
        let workerData = workerManager.get(workerName);
        socket.join(workerName);
        if (workerData !== undefined) {
            io.sockets.in(workerName).emit(`snapshot`, workerData.snapshot, workerData.timeStamp);
        }
    });
    socket.on(`request-server-status`, message => {
        socket.join(`server-status`);
        io.sockets.in(`server-status`).emit(`response`, workerManager.getStatusAll());
    });
});
function pushToClientSocket(workerName) {
    return function (message) {
        let timeStamp = Date.now();
        io.sockets.in(workerName).emit(`snapshot`, message, timeStamp);
        workerManager.update(workerName, message, timeStamp);
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
ipc.server.start();
server.listen(process.env.PORT || 80);
console.log(`# SERVER START AT ${new Date().toLocaleString()}`);