const {google} = require( "googleapis" );
const keys = require( "../key/GOOGLE_SPREAD_KEY.json" );
const { timeFormat, clog } = require("./common.js");
keys.private_key = keys.private_key.replace(new RegExp("\\\\n", "\g"), "\n");
const client = new google.auth.JWT(
    keys.client_email, null, keys.private_key, [ 'https://www.googleapis.com/auth/spreadsheets' ]
);

client.updateData = function (inputData, requestObject) {
    client.authorize( function( err, tokens ) {
        if( err ) {
            console.log( err );
            return;
        } else {
            gsrun_overwrite( client, [inputData] );
            clog(`[!] ${timeFormat(new Date())}`, `\x1b[32msend to spreadsheet@${requestObject.id}\x1b[0m`);
        }
    });

    async function gsrun_overwrite( client, data ) {
        const sheets = google.sheets({version: "v4", auth: client});
        const request = {
            spreadsheetId: requestObject.id,
            range: requestObject.range,
            valueInputOption: requestObject.valueInputOption,
            insertDataOption: requestObject.insertDataOption,
            resource: {values: data}
        };
        const response = await sheets.spreadsheets.values.update(request);
        //console.log(response);
    }
}

client.insertData = function (inputData, requestObject) {
    client.authorize( function( err, tokens ) {
        if( err ) {
            console.log( err );
            return;
        } else {
            gsrun_append( client, [inputData] );
            clog(`[!] ${timeFormat(new Date())}`, `\x1b[32msend to spreadsheet@${requestObject.id}\x1b[0m`);
        }
    });

    async function gsrun_append( client, data ) {
        const sheets = google.sheets({version: "v4", auth: client});
        const request = {
            spreadsheetId: requestObject.id,
            range: requestObject.range,
            valueInputOption: requestObject.valueInputOption,
            insertDataOption: requestObject.insertDataOption,
            resource: {values: data}
        };
        const response = await sheets.spreadsheets.values.append(request);
        //console.log(response);
    }

};

module.exports = client;
