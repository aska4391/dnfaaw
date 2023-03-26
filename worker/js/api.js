const request = require('request-promise-native');
const { clog, timeFormat, Color } = require('./common.js');
request.timeout = 1;

const opt_default = {
    sort : 'unitPrice:asc',                 //'unitPrice:<unitPrice>',
    limit : '300',                          // num '<limit>'
    wordType : 'front',                     // front| | '<wordType>'
    minReinforce : '<minReinforce>',
    reinforce : '<reinforce>'
};

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
API.prototype.requestItem = function (reqSpec) {
    let a = reqSpec;
    let b = opt_default;
    let APIURL = `https://api.neople.co.kr/df/auction?itemName=${encodeURIComponent(a.itemName)}&q=minLevel:<minLevel>,maxLevel:<maxLevel>,rarity:<rarity>,minReinforce:${a.minReinforce || b.minReinforce}>,maxReinforce:<maxReinforce>,minRefine:<minRefine>,maxRefine:<maxRefine>&sort=${this.opt.sort}&limit=${this.opt.limit}&wordType=${a.wordType || b.wordType}&apikey=${this.key}`;
    if(reqSpec.itemId !== undefined) APIURL = `https://api.neople.co.kr/df/auction?itemId=${encodeURIComponent(a.itemId)}&q=minLevel:<minLevel>,maxLevel:<maxLevel>,rarity:<rarity>,minReinforce:${a.minReinforce || b.minReinforce}>,maxReinforce:<maxReinforce>,minRefine:<minRefine>,maxRefine:<maxRefine>&sort=${this.opt.sort}&limit=${this.opt.limit}&wordType=${a.wordType || b.wordType}&apikey=${this.key}`;
    let option = { url : APIURL, timeout : 9000};
    return request(option);
};
API.prototype.requestItems = async function (requestSpecs) {
    let that = this;
    let snapshot = {};

    for (const reqSpec of requestSpecs) {
            let body = await requestItem$retryable(reqSpec);
            let parsed = JSON.parse(body).rows;
            if ( reqSpec.merge === undefined) {
                snapshot[reqSpec.itemName] = parsed; //parsed is array
            } else {
                snapshot[reqSpec.merge] = [ ...(snapshot[reqSpec.merge] || []), ...parsed ].filter(a => a);
            }
    }
    return snapshot;

    async function requestItem$retryable(requestSpecs) {
        let body;
        try {
            //console.log(requestSpecs);
            body = await that.requestItem(requestSpecs) || '{"rows": null}';
            if (body === undefined) throw new Error(`I don't know but body is undefined.`);
            return body;
        } catch (e) {
            let errm = e.message;
            if(errm.indexOf('API002') !== -1) {
                errorlog(errm);
                await new Promise(res => setTimeout(res,1000));
                return requestItem$retryable(requestSpecs);
            }
            else if (errm.indexOf('ETIMEDOUT') !== -1) {
                errorlog(errm);
                await new Promise(res => setTimeout(res,1000));
                return requestItem$retryable(requestSpecs);
            }
            else if (errm.indexOf('400') !== -1) {
                errorlog(errm);
                await new Promise(res => setTimeout(res,1000));
                return requestItem$retryable(requestSpecs);
            }
            else if (errm.indexOf('500') !== -1) {
                errorlog(errm);
                await new Promise(res => setTimeout(res,1000));
                return requestItem$retryable(requestSpecs);
            }
            else if (errm.indexOf('ECONNREFUSED') !== -1) {
                errorlog(errm);
                await new Promise(res => setTimeout(res,4000));
                return requestItem$retryable(requestSpecs);
            }
            else if (errm.indexOf('ESOCKETTIMEDOUT') !== -1) {
                errorlog(errm);
                await new Promise(res => setTimeout(res,4000));
                return requestItem$retryable(requestSpecs);
            }
            else if (errm.indexOf('ECONNRESET') !== -1) {
                errorlog(errm);
                await new Promise(res => setTimeout(res,4000));
                return requestItem$retryable(requestSpecs);
            }
            else if (errm.indexOf('503') !== -1) {
                errorlog(errm);
                await new Promise(res => setTimeout(res,600000));
                return requestItem$retryable(requestSpecs);
            }
            else if (errm.indexOf('ENOTFOUND') !== -1) {
                errorlog(errm);
                await new Promise(res => setTimeout(res,600000));
                return requestItem$retryable(requestSpecs);
            }
            else if (errm.indexOf('undefined') !== -1) {
                errorlog(errm);
                await new Promise(res => setTimeout(res,600000));
                return requestItem$retryable(requestSpecs);
            }
            else {
                console.log('---- error messege ----');
                errorlog(errm);
                console.log('---- error details ----');
                console.log(e);
                console.log('---- body object ----');
                console.log(body);
                console.log('---- error object ----');
                process.exit('unExpected Error', e.toString());
            }
        }
    }
    function errorlog (errMsg) {
        clog(`[!] ${timeFormat(new Date())}`, `${Color.fg.yellow}${Color.underscore}${errMsg}${Color.reset}`);
    }
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

module.exports = new API();
