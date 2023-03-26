module.exports = function (ipc, io) {

    ipc.config.id = 'listener';
    ipc.config.retry = 1500;
    ipc.config.silent = true;

    ipc.serve(() => ipc.server.on('package', message => {
        //console.log(message);
        Object.keys(io.sockets.adapter.rooms).forEach(function (id) {
            io.to(id).emit('snapshot-2', message, Date.now());
        });
    }));
    ipc.server.start();

};