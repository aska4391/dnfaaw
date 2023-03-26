//DIMENSIONPKG2022_EXT
const fs = require('fs');
const path = require('path');
const preset = require("./preset.json");
const apiInstance = require(path.join(__dirname,"../js/api.js"));
const worker = require(path.join(__dirname,"../js/Worker.js"));
const { errorHandling } = require(path.join(__dirname,"../js/common.js"));
const { scheduleType : {defaultSchedule : schedule}, taskType : {requestAuction : task} } = worker;

worker
    .setPreset(preset)
    .connectIPC()
    .setExcelPath('./list.xlsx')
    .setNeopleAPI(apiInstance, preset.apikey)
    .addSchedule(schedule, task)
    .run();

process.on('uncaughtException', errorHandling(preset.title));
