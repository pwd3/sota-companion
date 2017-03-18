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
var sprintf = require('sprintf').sprintf;


router.get('/', function(req, res, next) {
	var config = req.app.get('config');
	var hitdays = 10;
	var url = req.protocol + '://' + req.get('host') + req.originalUrl;
	var dbdir = req.app.get('dbdir');
	var hitwhen = moment().subtract(hitdays,'days').format('YYYY-MM-DD HH:mm:ss');
	var rdata = {
		days: hitdays,
		from: hitwhen,
		data: []
		};
	playerloc.parse(req, function(pdata) {
		var playerid = pdata.data.playerid;
		db.loadCollections(['avatars', 'hits-' + playerid]);
		var avdata = db.avatars.findOne({playerid: playerid});
		var rawdata = db['hits-'+playerid].find();
		rawdata.forEach(function(itm) {
			var num = 0;
			if(itm.damage.match(/\d+/)) {
				num = itm.damage.match(/(\d+)/)[0];
				}
			if(itm.damage.match(/critical/i)) {
				num *= 2;
				}
			itm.num = num;
			itm.damage = sprintf("%5d (%s)",parseInt(num,10),itm.damage);
			if(! itm.attack) itm.attack = 'Weapon';
			if(itm.by.match(/>/)) itm.attack = 'Pet';
			itm.rwhen = totcase(moment(itm.when).fromNow());
			if(hitwhen < itm.when) rdata.data.push(itm);
			});
		res.json(rdata);
		});

	});

module.exports = router;






