const Excel = require('exceljs');
const path = require('path');

function Worker() {
    this._path = null;
    this._workbook = null;
    this._API = null;
    this._itemNames = null;
    this._itemObjects = null;
    this._scheduler = null;
    this._task = null;
    this._delay = 0;
    this._console = [];

}

Worker.prototype.path = function (filename) {
    this._path = filename;
    return this;
};
Worker.prototype.api = function (apiInstance) {
    this._API = apiInstance;
    return this;
};
Worker.prototype.setApiKey = function (apiKey) {
    this._API.setKey(apiKey);
    return this;
};
Worker.prototype.setDelay = function (delay) {
    this._delay = delay;
    return this;
};

Worker.prototype.getItemList = () => {
    let worksheet = this._workbook.getWorksheet(1);
    let col = worksheet.getColumn(1);
    let itemNames = col.values;
    itemNames.splice(0,2);
    this._itemNames = itemNames;
    return this;
};
Worker.prototype.addSchedule = function (scheduler, task) {
    if(typeof scheduler === 'string' && scheduler === 'once') {
        this._scheduler = (task, param) => task(param, this._API);
        this._task = task;
    } else {
        this._scheduler = scheduler;
        this._task = task;
    }
    return this;
};

Worker.prototype.addNodeSchedule = function () {

}
Worker.prototype.run = async function (callback) {
    if(this._delay !== 0) await new Promise(res => setTimeout(res, this._delay));
    this._workbook = new Excel.Workbook();
    await this._workbook.xlsx.readFile(this._path);
    let worksheet = this._workbook.getWorksheet(1);
    let attributes = worksheet.getRow(1).values.slice(1);
    let itemNames = worksheet.getColumn(1).values.slice(2);
    let requestSpecifications = itemNames.map( (itemName, idx) => {
        if(itemName === undefined) console.error("itemName is undefined");
        // TODO : when cell has custom font, type of itemName is Object. it handle this line.
            let row = worksheet.getRow(idx+2).values.slice(1);
            let reqSpec = attributes.reduce( (acc, attribute, inner_idx) => {
                acc[attribute] = row[inner_idx];
                return acc;
            }, {})

            reqSpec.itemName = reqSpec.itemName.concat(typeof reqSpec.suffix === 'undefined' ? '' : reqSpec.suffix);
            return reqSpec;

    });
    this._itemNames = itemNames.filter(e => e);
    this._itemObjects = requestSpecifications.filter(e => e);
    console.log('@worker run at '+ new Date().toTimeString());
    this._scheduler(this._task, this._itemObjects);
};


module.exports = Worker;