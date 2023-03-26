var path = require('path');
var express = require('express');
var router = express.Router();

router.get("/*", function(req, res, next) {
    console.log('route.else : ' +req.originalUrl);
    return res.send('ERROR');
});

module.exports = router;