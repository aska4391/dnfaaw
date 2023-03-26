const fs = require('fs');

let WorkerManager = function () {
    this.workerList = [];
    this.rtd = {};  // realTimeData

    this.gatherWorkerList = function () {
        this.workerList = fs.readdirSync(`${__dirname}/../../worker`).map( (folderName, idx) => {
            if(!folderName.includes('@')) return null;
            return folderName.replace(/@/g, '').toUpperCase();
            //return folderName.replace(/@|_.+/g, '').toUpperCase();
        }).filter(a => a);
        console.log(this.workerList);
        return this;
    }
    this.addChangeListener = function (callback) {
        let that = this;
        fs.watch(`${__dirname}/../../worker`, function (eventType, fileName) {
            that.gatherWorkerList();
            callback(that.workerList);
        });
        return this;
    }
    this.get = function (workerName) {
        return this.rtd[workerName];
    }
    this.getStatusAll = function () {
        return this.rtd;
    }
    this.update = function (workerName, message, timeStamp) {
        if( this.rtd[workerName] === undefined ) this.rtd[workerName] = {snapshot : null, timeStamp : null};
        [ this.rtd[workerName].snapshot, this.rtd[workerName].timeStamp ] = [ message, timeStamp ];
    }
}


module.exports = new WorkerManager();
