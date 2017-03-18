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
var router = express.Router();
var db = require('diskdb');
var moment = require('moment');
var playerloc = require('../../../model/location');
var totcase = require('titlecase').toLaxTitleCase;
var fs = require('fs');
var jsonfile = require('jsonfile');

router.post('/', function(req, res, next) {
	var config = req.app.get('config');
	var url = req.protocol + '://' + req.get('host') + req.originalUrl;
	var dbdir = req.app.get('dbdir');
	var serverroot = req.app.get('serverroot');
	var cfgfile = serverroot + '/config/config.json';
	var msg = '';
	var rdata = {
		growler: {
			enabled: true,
			level: 'error',
			summary: 'Error - Routing Error in dashboard update',
			detail: "Please note the time and data and contact MDT to report this error"
			}
		}
	var newdata = JSON.parse(req.body.item);
	config.datadir = newdata.data.datadir;
	config.www.port = parseInt(newdata.data.www.port,10);
	config.showhitdays = parseInt(newdata.data.showhitdays,10);
	config.sweep.hitdays = parseInt(newdata.data.sweep.hitdays,10);
	config.sweep.statdays = parseInt(newdata.data.sweep.statdays,10);
	config.sweep.leveldays = parseInt(newdata.data.sweep.leveldays,10);
	if(config.datadir) {
		if(fs.existsSync(config.datadir + '/ChatLogs/')) {
			}
		else {
			msg = `
				The configured data directory "${config.datadir}"
				Does not contain a ChatLogs direcotry and is therefor
				invalid.
				Please type "/datafolder" in the SotA chat window and put the location
				shown in the "SotA Data Directory" field.
				`;
			}
		}
	else {
		msg = `
			The Data Diectory has not been configured.
			Please type "/datafolder" in the SotA chat window and put the location
			shown in the "SotA Data Directory" field.
			`;
		}


	jsonfile.writeFileSync(cfgfile, config, {spaces: 4});
	if(fs.existsSync(config.datadir + '/ChatLogs/')) {
		rdata.growler =  {
			enabled: true,
			level: 'info',
			summary: 'Data Saved',
			detail: `Profile data has been saved`
			};
		}
	else {
		rdata.growler =  {
			enabled: true,
			level: 'error',
			summary: 'Data Saved -- INVALID data directory',
			detail: `Profile save but no "ChatLogs" directory in data directory`
			};
		}
	playerloc.parse(req, function(pdata) {
		var playerid = pdata.data.playerid;
		rdata.data = config;
		rdata.msg = msg;
		res.json(rdata);
		});

	});

module.exports = router;


