const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Snapshot = require('./database/schema').Snapshot;
const Dictionary = require('./database/schema').Dictionnary;
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', () => console.log("Connected to mongod server"));
mongoose.connect('mongodb://localhost:27017/sample', { useNewUrlParser: true }, function(err) {
    if (err) console.error('mongodb connection error', err);
});


async function findAllkey () {
    let data = await Snapshot.find({}, {_id : false, _timeStamp : false}).exec();
    //console.log(data);
    let rtr = data.reduce((acc,cuv,idx) => {
        acc = {...acc, ...cuv["_doc"]};
        return acc;
    }, {});
    return Object.keys(rtr);
}

async function findby () {
    let data = await Dictionary.find({setItemName : "왕립 아라드 고교 리턴즈 패키지", jobName: "귀검사(남)"}).exec();
    return data;
}

let a = findby();
console.log('---');
console.log(a.then(d => console.log(d)));