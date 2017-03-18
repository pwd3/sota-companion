/*
 * 
 *  Copyright 2017 Philip W. Dalrymple III
 *
 *     Licensed under the Apache License, Version 2.0 (the "License");
 *     you may not use this file except in compliance with the License.
 *     A copy of the license is shipped with this software in the file
 *     called:
 *
 *     LICENSE -- Which can be found in the root of the distribution.
 *
 *     Unless required by applicable law or agreed to in writing, software
 *     distributed under the License is distributed on an "AS IS" BASIS,
 *     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *     See the License for the specific language governing permissions and
 *     limitations under the License.
 */


var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var dirwatcher = require('directory-watcher');
var fs = require('fs-extra');
var debounce = require('debounce');

var db = require('diskdb');


var chatlog = require('./model/chatlog');


var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('json spaces', 4);


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var dispatch = require('./config/dispatch.json');
var config = require('./config/config.json');

if(! config.sweep) config.sweep = {};
if(! config.showhitdays) config.showhitdays = 10;
if(! config.sweep.hitdays) config.sweep.hitdays = 20;
if(! config.sweep.statdays) config.sweep.statdays = 60;
if(! config.sweep.leveldays) config.sweep.leveldays = 600;

var serverroot = __dirname;

app.set('menus',dispatch.menus);

app.set('config',config);

app.set('serverroot',serverroot);


var logdir = path.join(serverroot, '../logs');
fs.existsSync(logdir) || fs.mkdirSync(logdir);

var dbdir = path.join(serverroot, '../db');
fs.existsSync(dbdir) || fs.mkdirSync(dbdir);
app.set('dbdir',dbdir);

if(fs.existsSync(config.datadir + '/ChatLogs/')) {
	chatlog.run(app);
	}

dispatch.routes.forEach( function(r) {
	r.handle = require(r.code);
	app.use(r.url,r.handle);
	});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

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
