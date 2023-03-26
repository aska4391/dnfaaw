// run all available workers in directory
const fs = require("fs");
const path = require("path");
const childProcess = require('child_process');

let dir  = fs.readdirSync(__dirname).map(function (workerName) {
    if(workerName.includes("@"))return workerName;
    else return false;
}).filter(e=>e);

let subprocess = [];
subprocess = dir.map(function (workerName) {
    return childProcess.exec(`node ${path.join(__dirname, workerName, `wi${workerName}.js`)}\n`, {maxBuffer : 1024 * 10000},
        (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
        });
});
subprocess.map(function (process) {
    process.stdout.setEncoding('utf8');
    process.stdout.on('data', on_child_stdout);
    function on_child_stdout (e) {
        e = e.replace(/\n/g, "");
        console.log(e)
    }
    process.stderr.setEncoding('utf8');
    process.stderr.on('data', on_child_stderr);
    function on_child_stderr (e) {
        console.log(e)
    }
})




