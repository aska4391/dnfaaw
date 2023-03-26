var path = require('path');
var express = require('express');
var router = express.Router();

module.exports = function (workerList) {
    router.wk = workerList;
    router.get('/:path', function(req, res, next) {

        let pathString = req.params.path.toString();
        if(!pathString.includes('@')) {
            next();
        }
        else if([ ...router.wk ].includes(`${pathString.replace('/','').replace('@','').toUpperCase()}`)) {
            res.sendFile(path.resolve('./', 'build', 'index.html'));
        } else {
            next();
        }
    });
    return router;
}
