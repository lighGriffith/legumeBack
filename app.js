var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var cors = require('cors');
var config = require('./config/indexDatabase');
var errorHandler=require('./js/error/errorHandler');

mongoose.connect(config.database, { useCreateIndex: true, useNewUrlParser: true });

var api = require('./routes/api');

var app = express();
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
if(process.env.NODE_ENV!="test"){
  app.use(morgan('dev'));
}
app.use(passport.initialize());
app.get('/', function(req, res) {
  res.send('Page under construction.');
});

app.use('/api', api);
// error handler
app.use(errorHandler);

module.exports = app;
