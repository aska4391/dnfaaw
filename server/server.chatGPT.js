const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const workerManager = require('./js/workerManager');
workerManager.gatherWorkerList('../worker');

const app = express();
app.use(cors());

//IMPORT ROUTERS
const chineseRouter = require('./routes/chinese');
const workerRouter = require('./routes/worker')(workerManager.workerList);

//USE ROUTERS
app.route('/chinese')
    .get(chineseRouter)

app.route('/worker')
    .get(workerRouter)

//SERVING STATIC BUILD REACT FILE
app.use('/static', express.static(path.join(__dirname, 'build/static')));

//SERVING ELSE
app.use(express.static(path.join(__dirname, 'build')));

//catch 404 and forward to error handler
app.use((req, res, next) => {
    console.log('* ROUTE ERROR? : ' +req.originalUrl);
    return res.status(404).send('ERROR');
});

//error handler
app.use((err, req, res) => {
    console.log('* ROUTE DEPTH 2 : '+ req.originalUrl);
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

//IPC CONNECT AND SOCKET.IO
const ipc = require('node-ipc');
ipc.config.id = 'listener';
ipc.config.retry = 1500;
ipc.config.silent = true;

const socketIO = require('socket.io');
const io = socketIO(app.listen(3000), {pingTimeout: 60000});

ipc.serve(() => {
    //add to workerlist
    workerManager.workerList.forEach((workerName) => {
        ipc.server.on(workerName, pushToClientSocket(workerName))
    });
});
ipc.server.start();