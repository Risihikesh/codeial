const mongoose= require('mongoose');

mongoose.connect('mongodb://127.0.0.1/codeial_development');

const db = mongoose.connection;

db.on('error', console.error.bind(console,"Error connecting to MongoDB"));

db.once('open', function(){
    console.log('Connected to Database:: MongoDB');
});

module.exports=db;
/** */
// const mongoose = require('mongoose');
// mongoose.set('strictQuery', false)
// mongoose.connect('mongodb://localhost/codeal_development');

// const db = mongoose.connection;

// db.on('error', console.error.bind(console, "error connectiong to mongodb"));

// db.once('open', function () {
//     console.log("connecting to database :: mongodb");
// })

// module.exports = db;