const request = require('request-promise-native');
request.timeout = 1;
const opt_default = {
    sort : 'unitPrice:asc',                 //'unitPrice:<unitPrice>',
    limit : '300',                          // num '<limit>'
    wordType : 'front',                     // front| | '<wordType>'
    minReinforce : '<minReinforce>',
    reinforce : '<reinforce>'
};

// zcdtejKQayW5rIV3HHoGHAgFcJRHj7gd // kgj key
// uUI8kZX3Nx0TNfL4rnuQYJuuly2E0QpX // osh key

function API() {
    this.opt = opt_default;
    this.EMPTY = 'EMPTY';
    this.key = undefined;
    this.snapShot = {};
    this.timeStamp = 0;
}

API.prototype.setOption = function (overrideOption) {
    if(typeof overrideOption !== "object" || Array.isArray(overrideOption) === true) {
        console.error('API : parameter is not Object');
        return this;
    }
    Object.keys(overrideOption).forEach((key) => this.opt[key] = overrideOption[key]);
    return this;
};

API.prototype.setKey = function (key) {
    this.key = key;
    return this;
};

API.prototype.requestItem = function (itemObject) {
    if(itemObject === undefined) {
        console.log(">> itemObject === undefined");
        return new Promise((res, rej) => res(API.EMPTY)).catch(function (err) {
            console.log(err);
        });
    }

    if(itemObject.itemName === undefined) {
        console.log(">> itemObject.itemName === undefined");
        return new Promise((res, rej) => res(API.EMPTY)).catch(function (err) {
            console.log(err);
        });
    }

    let a = itemObject;
    let b = opt_default;
    //console.log('limit : '+this.opt.limit);
    let APIURL = `https://api.neople.co.kr/df/auction?itemName=${encodeURIComponent(a.itemName)}&q=minLevel:<minLevel>,maxLevel:<maxLevel>,rarity:<rarity>,minReinforce:${a.minReinforce || b.minReinforce}>,maxReinforce:<maxReinforce>,minRefine:<minRefine>,maxRefine:<maxRefine>&sort=${this.opt.sort}&limit=${this.opt.limit}&wordType=${a.wordType || b.wordType}&apikey=${this.key}`;
    if(itemObject.itemId !== undefined) APIURL = `https://api.neople.co.kr/df/auction?itemId=${encodeURIComponent(a.itemId)}&q=minLevel:<minLevel>,maxLevel:<maxLevel>,rarity:<rarity>,minReinforce:${a.minReinforce || b.minReinforce}>,maxReinforce:<maxReinforce>,minRefine:<minRefine>,maxRefine:<maxRefine>&sort=${this.opt.sort}&limit=${this.opt.limit}&wordType=${a.wordType || b.wordType}&apikey=${this.key}`;

    let option = { url : APIURL, timeout : 9000};

    return request(option);
};

API.prototype.requestItems = async function (itemObjects) {
    let that = this;
    let snapshot = {};
    let body;
    for (const item of itemObjects) {
        let itemName = item.itemName;
        if(itemName !== undefined) {
            body = await selfRestore(item);
            let parsed = JSON.parse(body).rows; // TODO : when error, return undefined
            if ( item.merge === undefined) {
                snapshot[itemName] = parsed; //parsed is array
            } else {
                snapshot[item.merge] = [ ...snapshot[item.merge], ...parsed ].filter( a => a );
                //if (obj[item.merge] !== undefined) obj[item.merge] =  [...obj[item.merge], ...parsed];
                //else obj[item.merge] = parsed;
            }

        }
    }
    async function selfRestore(itemObject) {
        try {
            //console.log("that.reuqestItem():befere");
            let body = await that.requestItem(itemObject) || '{"rows": null}';

            if (body === undefined) {
                await new Promise(res => setTimeout(res,1000));
                return selfRestore(itemObject);
            } else return body;

        } catch (e) {
            let errm = e.message;

            if(errm.indexOf('API002') !== -1) {
                console.log(`ERROR : API002 : ${new Date().toLocaleString()} - ${errm}`);
                await new Promise(res => setTimeout(res,1000));
                return selfRestore(itemObject);
            }
            else if (errm.indexOf('ETIMEDOUT') !== -1) {
                console.log(`ERROR : ETIMEDOUT : ${new Date().toLocaleString()} - ${errm}`);
                await new Promise(res => setTimeout(res,1000));
                return selfRestore(itemObject);
            }
            else if (errm.indexOf('400') !== -1) {
                console.log(`ERROR : 400 : ${new Date().toLocaleString()} - ${errm}`);
                await new Promise(res => setTimeout(res,1000));
                return selfRestore(itemObject);
            }
            else if (errm.indexOf('500') !== -1) {
                console.log(`ERROR : 500 : ${new Date().toLocaleString()} - ${errm}`);
                await new Promise(res => setTimeout(res,1000));
                return selfRestore(itemObject);
            }
            else if (errm.indexOf('503') !== -1) {
                console.log(`ERROR : API503 : ${new Date().toLocaleString()} - ${errm}`);
                await new Promise(res => setTimeout(res,600000));
                return selfRestore(itemObject);
            } else {
                console.log('---- error messege ----');
                console.log(errm);
                console.log('---- error details ----');
                console.log(e);
                console.log('---- body object ----');
                console.log(body);
                console.log('---- error object ----');
                process.emit('unExpected Error', e.toString());
            }
        }
    }
    return snapshot;
};

API.prototype.getLowest = function (body) {
    let rows = JSON.parse(body).rows;
    let priceList = rows.reduce((acc, cuv, idx) => {
        acc.push(cuv.unitPrice);
        return acc;
    }, []);
    return priceList[0];
};

API.prototype.getSnapshot = function (body) {
    let rows = JSON.parse(body).rows;
    this.snapShot = rows;
    return rows;
};

module.exports = API;