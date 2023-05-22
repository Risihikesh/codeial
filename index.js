const express= require('express');
const app=express();
const port=8000;
const expressLayouts= require('express-ejs-layouts');
//importing mongoose.js
// const db= require('./config/mongoose');
const db = require('./config/mongoose');

app.use(express.static('./assets'));

app.use(expressLayouts);

//extract styles and script from sub pages into the layouts
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);

//use express router
app.use('/',require('./routes')) // or we can just use /routes it will automatically fetch index.js in routes


//setup the view engine
app.set('view engine', 'ejs');
app.set('views', './views');




app.listen(port, function(err){
    if(err){
        // console.log('Error', err); or we can 
        console.log(`Error in running a server: ${err}`);

    }
    console.log(`Server is running on port: ${port}`);
})