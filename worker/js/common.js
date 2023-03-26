const fs = require('fs');

let _ = {};
_.hashCode = function (s){
    return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
}
_.timeFormat = function (time) {
    let formattedTimeString = `${time.getFullYear()}-${(time.getMonth()+1).toString().padStart(2, '0')}-${time.getDate().toString().padStart(2, '0')} ${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}:${time.getSeconds().toString().padStart(2, '0')}`
    return formattedTimeString;
}
_.errorHandling = function (processTitle, worker) {
        return function (e) {
            let eot = new Date();
            let errorOccuredTime = _.timeFormat(eot);
            errorOccuredTime = errorOccuredTime.replace(/:/g,'ː');
            console.error(`> ${errorOccuredTime}`);
            console.error(e);
            fs.writeFile(`../log/${ errorOccuredTime }__${processTitle}`, e.toString() + "\n" + "---\n" + JSON.stringify(worker.snapshot), 'utf8', () => process.exit(0));
        }
}
_.clog = function () {
    let args = Array.from(arguments);
    let str = ``;
    args.forEach(arg => str += `${arg} | `);
    console.log(str.slice(0,-2));
}
_.Color = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    underscore: "\x1b[4m",
    blink: "\x1b[5m",
    reverse: "\x1b[7m",
    hidden: "\x1b[8m",
    fg: {
        black: "\x1b[30m",
        red: "\x1b[31m",
        green: "\x1b[32m",
        yellow: "\x1b[33m",
        blue: "\x1b[34m",
        magenta: "\x1b[35m",
        cyan: "\x1b[36m",
        white: "\x1b[37m",
        crimson: "\x1b[38m" // Scarlet
    },
    bg: {
        black: "\x1b[40m",
        red: "\x1b[41m",
        green: "\x1b[42m",
        yellow: "\x1b[43m",
        blue: "\x1b[44m",
        magenta: "\x1b[45m",
        cyan: "\x1b[46m",
        white: "\x1b[47m",
        crimson: "\x1b[48m"
    }
};
module.exports = _;
