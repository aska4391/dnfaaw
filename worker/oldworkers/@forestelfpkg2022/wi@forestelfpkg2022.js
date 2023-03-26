//GOTH2022
const path = require('path');
const preset = require("./preset.json");
const apiInstance = require(path.join(__dirname,"../js/api.js"));
const worker = require(path.join(__dirname,"../js/Worker.js"));
const { timeFormat, errorHandling } = require(path.join(__dirname,"../js/common.js"));
const { scheduleType : {defaultSchedule : schedule}, taskType : {requestAuction : task} } = worker;

worker
    .setPreset(preset)
    .connectIPC()
    .setExcelPath('./list.xlsx')
    .setNeopleAPI(apiInstance, preset.apikey)
    .addSchedule(schedule, task)
    .run();

const nodeScheduler = require('node-schedule');
const googleClient = require(path.join(__dirname, "../js/google_sheet_append.js"));

nodeScheduler.scheduleJob('20 0 12 * * *', function() {
    if(worker._snapshot === undefined) return;
    let prices = Object.keys(worker._snapshot).map(itemName => worker._snapshot[itemName][0].unitPrice);
    let data = [ timeFormat(worker._lastSendTime), ...prices ];
    googleClient.insertData(data, preset.spreadsheet);
})

process.on('uncaughtException', errorHandling(preset.title, worker));
