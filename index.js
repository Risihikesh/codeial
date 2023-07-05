const express= require('express');
const cookieParser = require('cookie-parser');
const app=express();
const port=8000;
const expressLayouts= require('express-ejs-layouts');
//importing mongoose.js
// const db= require('./config/mongoose');
const db = require('./config/mongoose');

//used for session cookies
const session= require('express-session');
const passport=require('passport')
const passportLocal= require('./config/passport-local-strategy');

const passportJWT= require('./config/passport-jwt-strategy')
const passportGoogle= require('./config/passport-google-oauth2-strategy')


const MongoStore = require('connect-mongo')
// here i have used node version 16.0.0 bcs node sass middleware is depreceated from higher version 
//earlier i have done sass-middleware but scss file was not compiling
const sassMiddleware= require('node-sass-middleware');
// reading  through post request
// app.use(express.urlencoded);


const flash= require('connect-flash');
const customMware= require('./config/middleware')

//chatting engine
//setup the chat server to be used with socket.io
const chatServer= require('http').Server(app);
const chatSockets= require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log('chat server is listening on port 5000')


app.use(sassMiddleware({
    src: './assets/scss',
    dest:'./assets/css',
    debug: true,
    outputStyle: 'extended',
    prefix: '/css'
}))

app.use(cookieParser());
app.use(express.static('./assets'));

//take upload path available to the browser
app.use('/uploads', express.static(__dirname + '/uploads'))

app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }))

//extract styles and script from sub pages into the layouts
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);

//use express router
// app.use('/',require('./routes')) // or we can just use /routes it will automatically fetch index.js in routes


//setup the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

//mongo store is used to store th session cookie in the db
app.use(session({
    name: 'codeial',
    //TODO change the secret before deployment in production mode
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie:{
        maxAge: (1000 * 60 * 100)
    },
    store: new MongoStore({
        mongoUrl: 'mongodb://127.0.0.1/codeial_development', //i have used new mongo connect code
        mongooseConnection:db,
        autoRemove:'disabled'
    },
    function(err){
        console.log(err || 'connect-mongo db setup ok');
    })
}));

app.use(passport.initialize());
app.use(passport.session()); // passport also help in maintaining session

app.use(passport.setAuthenticatedUser)

//we have to use flash message session bcs it uses the session cookies
app.use(flash());
app.use(customMware.setFlash);

app.use('/', require('./routes'));


app.listen(port, function(err){
    if(err){
        // console.log('Error', err); or we can 
        console.log(`Error in running a server: ${err}`);

    }
    console.log(`Server is running on port: ${port}`);
});

