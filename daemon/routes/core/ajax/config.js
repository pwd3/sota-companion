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

router.get('/', function(req, res, next) {
	var config = req.app.get('config');
	var url = req.protocol + '://' + req.get('host') + req.originalUrl;
	var dbdir = req.app.get('dbdir');
	var rdata = {
		data: []
		};
	
	var msg = '';
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

	playerloc.parse(req, function(pdata) {
		var playerid = pdata.data.playerid;
		rdata.data = config;
		rdata.msg = msg;
		res.json(rdata);
		});

	});

module.exports = router;


