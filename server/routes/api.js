const express = require('express');
const mongoose = require('mongoose');
const Snapshot = require('../database/schema').Snapshot;

var router = express.Router();

/* GET home page. */
router.get('/*', async function(req, res, next) {
    res.send("api service isn't available now");
});

router.get('/getIndex', async function(req, res, next) {
    let data = await Snapshot.find({}, {_id : false, _timeStamp : false}).exec();
    let indexesObject = data.reduce((acc,cuv,idx) => {
        acc = {...acc, ...cuv["_doc"]};
        return acc;
    }, {});
    let indexes = Object.keys(indexesObject);
    res.send(indexes);
});

router.get('/package/:packageName', function (req, res, next) {
    Snapshot.find({"rows.setItemName" : req.params.packageName}).exec(function (err, data) {
        console.log(req.params.packageName);
        console.log(data);
        let rData = data.reduce((acc, cuv, idx) => {
            acc[idx] = cuv;
            return acc;
        }, {});
        res.send(rData);
    })
});

router.get('/:itemName', function(req, res, next) {
    Snapshot.find({[req.params.itemName] : { "$exists" : true }}, {[req.params.itemName] : 1, _timeStamp : 1}).sort({"_timeStamp" : -1}).exec(function (err, data) {
        if(err) console.log(err);
        let rData = data.reduce((acc, cuv, idx) => {
            acc[idx] = cuv;
            return acc;
        }, {});
        res.send(rData);
    });
});



module.exports = router;
