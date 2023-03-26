//const googleClient = require(path.join(__dirname, "./google_sheet_append.js"));
//googleClient.insertData(data, preset.spreadsheet);


let f = { foo : {}};

f.bar = [ f.bar, ... '1'].filter(a=>a);
console.log(f);

let errorHandling = function () {
    try {
        nonExistentFunction();
    } catch (e) {

    }

    return 'haha';
}

let a = errorHandling();

console.log(a);
