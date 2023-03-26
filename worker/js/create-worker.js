const fs = require("fs");
const _ = require("../js/common.js");
let dest = process.argv[2];
let src = `./js/@basic-worker`;
let workerName = dest;
dest = "./@" + dest;

if(!fs.existsSync(src)) {
    console.log(`${_.Color.fg.red}basic-worker is not exist. can not create new worker${_.Color.reset}`);
    clean();
}
if(dest === undefined) {
    console.log(`${_.Color.fg.red}type worker's name to argument${_.Color.reset}`);
    clean();
}
if(fs.existsSync(`${dest}`)) {
    console.log(`${_.Color.fg.red}already exist '@${dest}' in worker directory, delete before create-worker${_.Color.reset}`);
    process.exit();
}

fs.mkdirSync(`${dest}`, {recursive : true});
let data, cData;

let filename = "preset.json";
fs.copyFileSync(`${src}/${filename}`, `${dest}/${filename}`);
data = fs.readFileSync(`${dest}/${filename}`);
cData = data.toString().replace(/%WORKERNAME%/gi, workerName.toUpperCase());
fs.writeFileSync(`${dest}/${filename}`, cData);

filename = "list.xlsx";
fs.copyFileSync(`${src}/${filename}`, `${dest}/${filename}`);
data = fs.readFileSync(`${dest}/${filename}`);
fs.writeFileSync(`${dest}/${filename}`, data);

filename = "wi@%WORKERNAME%.js";
fs.copyFileSync(`${src}/${filename}`, `${dest}/${filename.replace(`%WORKERNAME%`, `${workerName}`)}`);
data = fs.readFileSync(`${dest}/${filename.replace(`%WORKERNAME%`, `${workerName}`)}`);
cData = data.toString().replace(/%WORKERNAME%/gi, dest);
let desc = `/* \n`;
desc += `create-data : ${new Date().toLocaleString()} \n`;
desc += `worker-name : ${workerName} \n`;
desc += `*/ \n`;
fs.writeFileSync(`${dest}/${filename.replace(`%WORKERNAME%`, workerName)}`, desc + cData);

console.log(`${_.Color.fg.green}create worker successfully! (${dest})${_.Color.reset}`)

function clean () {
    fs.rmdirSync(dest);
    process.exit();
}