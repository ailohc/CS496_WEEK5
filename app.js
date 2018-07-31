var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var socket_io = require('socket.io');
var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var boardRouter = require('./routes/board');

var app = express();
var socket_io    = require( "socket.io" );
var io           = socket_io();
app.io           = io;


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(cookieParser());
app.use(session({
 secret: '@#@$MYSIGN#@$#$',
 resave: false,
 saveUninitialized: true
}));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use(function(req,res,next) {
    if(req.headers["x-forwarded-proto"] == "http") {
        res.redirect("https://sambong.koreacentral.cloudapp.azure.com" + req.url, next);
    } else {
        return next();
    }
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/board', boardRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


io.on( "connection", function( socket )
{
    console.log( "A user connected" );
});

var chatRouter = require('./routes/chat')(io);

app.use('/chat', chatRouter);



// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
