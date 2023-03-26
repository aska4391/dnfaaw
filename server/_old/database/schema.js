const mongoose = require('mongoose');
let Schema = mongoose.Schema;

// DEFINE SCHEMA
let testSchema = new Schema(
    {   // define fields
        _timeStamp : { type : Date, expires : 20, default : Date.now() }
    },
    {   // define collection path
        collection: '_experiment',
        versionKey: false
    },
    {   // define option
        strict: false
    }
);
let snapshotSchema = new Schema(
    {   // define fields
        _timeStamp : { type : Date, expires : '30d', default : Date.now() }
    },
    {   // define option
        //collection: '_experiment',
        versionKey: false,
        strict: false
    }
);
let dictionarySchema = new Schema(
    {   // define fields
        itemId : {type:String, unique: true}
    },
    {   // define option
        //collection: '_experiment',
        versionKey: false,
        strict: false
    }
);

module.exports = {
    Test : mongoose.model('Test', testSchema),
    Snapshot : mongoose.model('Snapshot', snapshotSchema),
    Dictionnary : mongoose.model('Dictionary', dictionarySchema)
};