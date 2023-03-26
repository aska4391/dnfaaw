// MONSTER
const TITLE = 'MONSTER';
const APIKEY = 'zcdtejKQayW5rIV3HHoGHAgFcJRHj7gd';

const fs = require('fs');
const path = require('path');
const API = require(path.join(__dirname,"../js/api.js"));
const Worker = require(path.join(__dirname,"../js/Worker.js"));
const ipc = require('node-ipc');
const hashCode = require(path.join(__dirname,"../js/common.js"));

ipc.config.id = TITLE;
ipc.config.retry = 1500;
ipc.config.silent = true;

let worker = new Worker();
let apiInstance = new API();
//apiInstance.setOption({minReinforce : 5});

ipc.connectTo('listener', () => {
    ipc.of['listener'].on('connect', () => {
        console.log(`$IPC : CONNECT`);
        if(worker._prevHash) worker._prevHash = 0;
    });
});

let scheduler = async (task, param) => {
    while (true) {
        await task(param, apiInstance);
        await new Promise(res => setTimeout(res,300000));
    }
};
let scheduler_test = (task, param) => setInterval(task, 5000, param, apiInstance);
let task = async (itemNames, apiInstance) => {
    let startTime = Date.now();
    let snapshot = await apiInstance.requestVertical(itemNames);
    worker._snapshot = snapshot;
    let endTime = Date.now();

    let hashed = hashCode(JSON.stringify(snapshot));
    let elapsedTime = endTime - startTime;
    let sendTime = new Date().toLocaleString();
    let isSameData = worker._prevHash === hashed;


    if(!isSameData) {
        worker._prevHash = hashed;
        ipc.of['listener'].emit(TITLE, snapshot);
        //fs.writeFile(`../temp/${sendTime.replace(/:/g,'`')}.json`, JSON.stringify(snapshot), 'utf8', ()=>{});
    }
    console.log(`${TITLE} \t | ${hashed}\t | ${elapsedTime}ms\t | ${sendTime} | ${isSameData ? 'discharge' : 'sending'}`);
};

worker
    .path('./list.xlsx')
    .api(apiInstance)
    .setApiKey(APIKEY)
    .addSchedule(scheduler, task)
    .run();

process.on('unExpected Error', e => {
    fs.writeFile(`../log/${TITLE}-error-${new Date().toLocaleString().replace(/:/g,'`')}.json`, e, 'utf8', () => process.exit(0));
});
