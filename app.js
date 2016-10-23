var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var routes = require('./routes/index');
var users = require('./routes/users');

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);//将session存入mongodb
var port = process.env.PORT || 3000;
var app = express();
app.locals.moment = require('moment');

// Models

var dbUrl = 'mongodb://localhost/immoc';
mongoose.connect(dbUrl);

app.use(cookieParser());
app.use(session({
    secret: 'imooc',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
        url: dbUrl,
        collection: 'session'
    })
}));

// view engine setup
app.set('views', path.join(__dirname, './views/pages'));
app.set('view engine', 'jade');
app.listen(port);
console.log('movie nodejs started on port: ' + port);

// static file path
app.use(express.static(path.join(__dirname, 'public')));

// form data seralize
app.use(bodyParser());

// routes
require('./config/routes.js')(app);



module.exports = app;
