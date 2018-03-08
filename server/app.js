// dependencies
var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var mongoose = require('mongoose');
var hash = require('bcrypt-nodejs');
var path = require('path');
var passport = require('passport');
var localStrategy = require('passport-local' ).Strategy;
var nvd3 = require('nvd3');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');

var MONGO_DB;
var DOCKER_DB = process.env.DB_PORT;
if ( DOCKER_DB ) {
  MONGO_DB = DOCKER_DB.replace( 'tcp', 'mongodb' ) + '/mean-auth';
} else {
  MONGO_DB = process.env.MONGODB;
}
var retry = 0;
mongoose.connect(MONGO_DB);
console.log(process.env);

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// user schema/model
var User = require('./models/user.js');
var Edificio = require('./models/edificio.js');

// create instance of express
var app = express();

// favicon
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

// require routes
var userRouter = require('./routes/userApi.js');
var edificioRouter = require('./routes/edificioApi.js');
var estatisticaRouter = require('./routes/estatisticaApi.js');
var relatorioRouter = require('./routes/relatorioApi.js');
//var routes = require('./routes/api.js')
var universidadeRouter = require('./routes/universidadeApi.js')
// define middleware
var caixaRouter = require('./routes/caixaDeAguaApi.js');


// define middleware
app.use(express.static(path.join(__dirname, '../client')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

// configure passport
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// routes
app.use('/', edificioRouter.data.router);
app.use('/', userRouter.data.router);
app.use('/', universidadeRouter);
app.use('/', estatisticaRouter.data.router);
app.use('/', relatorioRouter);
app.use('/', caixaRouter);

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../client', 'index.html'));
});

// DEFAULT USER
User.register(new User({
  username: 'default@email.com'}),
  'default', function(err, account) {
    if (err) {
      
    }
  });

// error hndlers
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  /*next(err);*/
  res.status(404).send('404 - Not found');
});
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(function(err, req, res) {
  res.status(err.status || 500);
  res.status(404);
  /*res.send(JSON.stringify({
    message: err.message,
    error: {}
  }));*/
});

module.exports = app;
