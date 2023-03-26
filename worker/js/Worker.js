const Excel = require('exceljs');
const path = require('path');
const ipc = require('node-ipc');
const { hashCode, timeFormat, clog, Color } = require('./common.js');

function Worker() {
    this.profile = {};
    this.path;
    this.workbook;
    this.neopleApi;
    this.itemNames;
    this.requestSpecifications;
    this.scheduler;
    this.task;
    this.ipc;
}

function estim() {
    this.neopleApiInstance;
    this.requestSpecifications;
    this.scheduler;
    this.task;
    this.ipc;
}

Worker.prototype.setPreset = function (preset) {
    console.log()
    console.log('\x1b[7m\x1b[96mStarting the worker at '+ timeFormat(new Date()) ,'\x1b[0m');
    this.preset = preset;
    return this;
};
Worker.prototype.connectIPC = function (title) {
    if (title === undefined) title = this.preset.title;
    let that = this;
    ipc.config.id = title;
    ipc.config.retry = 1500;
    ipc.config.silent = true;
    this.ipc = ipc;
    this.ipc.connectTo('listener', () => {
        this.ipc.of['listener'].on('connect', () => {
            clog(`${Color.fg.yellow}[!] ${timeFormat(new Date())} ${that.preset.title}`, `IPC CONNECT${Color.reset}`);
            if(that.prevHash) that.ipc.of['listener'].emit(that.preset.title, that.snapshot);
        });
        this.ipc.of['listener'].on('disconnect', () => {
            clog(`${Color.fg.yellow}[!] ${timeFormat(new Date())} ${that.preset.title}`, `IPC DISCONNECT. RETRY CONNECT...${Color.reset}`);
        })
        this.ipc.of['listener'].on('status', ()=> {
            that.ipc.of['listener'].emit(that.preset.title, that);
        })
    });
    return this;
};
Worker.prototype.setExcelPath = function (filename) {
    this.path = filename;
    return this;
};
Worker.prototype.setNeopleAPI = function (apiInstance, apiKey) {
    this.neopleApi = apiInstance;
    if(apiKey !== undefined) this.neopleApi.setKey(apiKey);
    return this;
};
Worker.prototype.getItemList = () => {
    let worksheet = this.workbook.getWorksheet(1);
    let col = worksheet.getColumn(1);
    let itemNames = col.values;
    itemNames.splice(0,2);
    this.itemNames = itemNames;
    return this;
};
Worker.prototype.addSchedule = function (scheduler, task) {
    if(typeof scheduler === 'string' && scheduler === 'once') {
        let caller = this;
        this.scheduler = (task, param) => task(param, this.neopleApi, caller);
        this.task = task;
    } else {
        this.scheduler = scheduler;
        this.task = task;
    }
    return this;
};
Worker.prototype.addSpreadSheet = function () {
    const nodeScheduler = require('node-schedule');
    const googleClient = require(path.join(__dirname, "../js/google_sheet_append.js"));
    let that = this;
    nodeScheduler.scheduleJob('10 26,40,59 * * * *', function () {
        if(that.snapshot === undefined) return;
        let prices = Object.keys(that.snapshot).map(itemName => {
            let item = that.snapshot[itemName];
            if(item.length === 0) return undefined;
            else return that.snapshot[itemName][0].unitPrice
        });
        let data = [ timeFormat(new Date()), timeFormat(that.lastSendTime), ...prices ];
        googleClient.updateData(data, that.preset.spreadsheet);
    })
    return this;
};
Worker.prototype.getStatus = function () {
    let status = Object.keys(this).map(e=>e);
    return status;
}
Worker.prototype.taskType = {
    requestAuction : async function (itemObjects, apiInstance, caller) {
        let startTime = Date.now();
        let snapshot = await apiInstance.requestItems(itemObjects);
        let endTime = Date.now();
        let elapsedTime = endTime - startTime;
        let sendTime = new Date();
        let hash = Math.abs(hashCode(JSON.stringify(snapshot)));
        let isSameSnapshot = caller.prevHash === hash;

        caller.snapshot = snapshot;
        caller.lastSendTime = sendTime;

        if(!isSameSnapshot) {
            caller.prevHash = hash;
            caller.ipc.of['listener'].emit(caller.preset.title, snapshot);
        }
        //clog(caller.preset.title, hash, `${elapsedTime}ms`, timeFormat(sendTime), isSameSnapshot ? `discharge` : `update`);
        clog(`[!] ${timeFormat(sendTime)} ${caller.preset.title}`, Number(hash).toString().slice(0,6), `${elapsedTime}ms`, isSameSnapshot ? `discharge` : `${Color.bright}update${Color.reset}`);
    }
};
Worker.prototype.scheduleType = {
        defaultSchedule : async (task, param, caller) => {
            while (true) {
                await task(param, caller.neopleApi, caller);
                await new Promise(res => setTimeout(res, caller.preset.refreshRate));
            }
        }
};
Worker.prototype.getRequestSpecifications = function (worksheet) {
    let attributes = worksheet.getRow(1).values.slice(1);
    let itemNames = worksheet.getColumn(1).values.slice(2);
    let requestSpecifications = itemNames.map((itemName, idx) => {
        if(itemName === undefined) console.error("itemName is undefined");
        // TODO : when cell has custom font, type of itemName is Object. it handle this line.
            let row = worksheet.getRow(idx+2).values.slice(1);
            let reqSpec = attributes.reduce( (acc, attribute, innerIdx) => {
                acc[attribute] = row[innerIdx];
                return acc;
            }, {})
            reqSpec.itemName = [ reqSpec.itemName, reqSpec.suffix ].join(" ").trim();
            return reqSpec;
    });
    return requestSpecifications;
};
Worker.prototype.run = async function (callback) {
    // set worker's profile
    this.profile = this.preset;
    this.profile.startTime = new Date().valueOf();

    //
    let caller = this;
    this.workbook = new Excel.Workbook();
    await this.workbook.xlsx.readFile(this.path);
    let worksheet = this.workbook.getWorksheet(1);
    let requestSpecifications = this.getRequestSpecifications(worksheet);
    this.requestSpecifications = requestSpecifications.filter(e => e);

    this.scheduler(this.task, this.requestSpecifications, caller);
};


module.exports = new Worker();
