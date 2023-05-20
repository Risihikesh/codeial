const express= require('express');
const app=express();
const port=8000;

//use express router
app.use('/',require('./routes/index')) // or we can just use /routes it will automatically fetch index.js in routes


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