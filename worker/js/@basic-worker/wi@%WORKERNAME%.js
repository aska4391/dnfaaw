const path = require('path');
const preset = require("./preset.json");
const apiInstance = require(path.join(__dirname,"../js/api.js"));
const worker = require(path.join(__dirname,"../js/Worker.js"));
const { timeFormat, errorHandling } = require(path.join(__dirname,"../js/common.js"));
const { scheduleType : {defaultSchedule : schedule}, taskType : {requestAuction : task} } = worker;

worker
    .setPreset(preset)
    .connectIPC()
    .setExcelPath(path.join(__dirname, './list.xlsx'))
    .setNeopleAPI(apiInstance, preset.apikey)
    .addSchedule(schedule, task)
    .run();

process.on('uncaughtException', errorHandling(preset.title, worker));
