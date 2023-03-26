// ARADSCHOOL PACKAGE
const TITLE = 'ARADSCHOOL';

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

ipc.connectTo('listener', () => {
    ipc.of['listener'].on('connect', () => {
        console.log(`$IPC : CONNECT`);
        if(worker._prevHash) worker._prevHash = 0;
    });
});

let scheduler = async (task, param) => {
    while (true) {
        await task(param, apiInstance);
        await new Promise(res => setTimeout(res,1000));
    }
};
let task = async (itemNames, apiInstance) => {
    let startTime = Date.now();
    let snapshot = await requestAll_vertical(itemNames, apiInstance);
    worker._snapshot = snapshot;
    let endTime = Date.now();

    let hashed = hashCode(JSON.stringify(snapshot));
    let elapsedTime = endTime - startTime;
    let sendTime = new Date().toTimeString();
    let isSameData = worker._prevHash === hashed;


    if(!isSameData) {
        worker._prevHash = hashed;
        ipc.of['listener'].emit(TITLE, snapshot);
    }
    console.log(`${TITLE} \t | ${hashed}\t | ${elapsedTime}ms\t | ${sendTime} | ${isSameData ? 'discharge' : 'sending'}`);
};

worker
    .path('./list.xlsx')
    .api(apiInstance)
    .setApiKey('zcdtejKQayW5rIV3HHoGHAgFcJRHj7gd')
    .addSchedule(scheduler, task)
    .run();

process.on('unExpected Error', e => {
    fs.writeFile(`../log/${TITLE}-error-${new Date().toDateString()}.json`, e, 'utf8', () => process.exit(0));
});






function cvt (num) {
    let str = String(Math.abs(num));
    return str.split('').map((elem)=> 1*elem).reduce((acc,cuv) => {
        acc += String.fromCharCode(97+cuv);
        return acc;
    },'');
}

async function requestAll(itemNames, apiInstance) {
    let snapshot = {};
    let body;
    let promise = itemNames.map(async item => {
        if(item === undefined) return;
        try {
            body = await apiInstance.requestItem(item) || '{"rows": null}';
        } catch (e) {
            if (e.message.indexOf('APIKEY_LIMIT')) {
                console.log('APIKEY_LIMIT');
                await new Promise(res => setTimeout(res,1000));
                body = await apiInstance.requestItem(item) || '{"rows": null}';
            } else {
                process.emit('unExpected Error', e.toString());
            }
        }
        let parsed = JSON.parse(body).rows;
        snapshot[item] = parsed;
    });
    return Promise.all(promise).then(() => snapshot);
}

async function requestAll_vertical(itemNames, apiInstance) {
    //console.log(itemNames);
    let obj = {};
    let body;
    for (const item of itemNames) {
        if(item !== undefined) {
            body = await selfRestore(item);
            let parsed = JSON.parse(body).rows;
            obj[item] = parsed;
        }
    }
    async function selfRestore(itemName) {
        try {
            body = await apiInstance.requestItem(itemName) || '{"rows": null}';
            return body;
        } catch (e) {
            let errm = e.message;
            if(errm.indexOf('API002') !== -1) {
                console.log(`ERROR : API002 : ${new Date().toLocaleString()} - ${errm}`);
                await new Promise(res => setTimeout(res,1000));
                return selfRestore(itemName);
            } else if (errm.indexOf('503') !== -1) {
                console.log(`ERROR : API503 : ${new Date().toLocaleString()} - ${errm}`);
                await new Promise(res => setTimeout(res,600000));
                return selfRestore(itemName);
            } else {
                process.emit('unExpected Error', e.toString());
            }
        }
    }
    return obj;
}
