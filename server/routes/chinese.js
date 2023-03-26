var express = require('express');
var router = express.Router();

router.get("*", function(req, res, next) {
    let path = req.originalUrl;
    let regExp = new RegExp(/showLogin\.cc|druid\/index\.html|debug\/default\/view|git|sitemap|pma|php|boaform|setup|.env|.cgi|admin|webadmin|mysql|database|sql|shop|vendor|ignition|wp-|manager|shell|blackhats/gi);
    let isChiness = path.match(regExp) !== null;
    if(isChiness) {
        res.status(404);
        res.send(null);
        console.log('route.chiness : ' + path);
    }
    else {
        next();
    }
});

module.exports = router;