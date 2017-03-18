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
var ui = require('../../util/ui');
var playerloc = require('../../model/location');
var db = require('diskdb');
var fs = require('fs');

router.get('/', function(req, res, next) {
	var config = req.app.get('config');
	var url = req.protocol + '://' + req.get('host') + req.originalUrl;

	//var logger = req.app.get('logger');
	//var logloc = 'route/core/home-get';

	if(fs.existsSync(config.datadir + '/ChatLogs/')) {
		ui.getui(req, function(uidata) {
			var title = 'S-O-T-A Companion Levels';
			playerloc.parse(req, function(pdata) {
				playerid = pdata.data.playerid;
				//db.loadCollections(['avatars', 'stats-' + playerid]);
				//console.log("P-Data " + JSON.stringify(pdata, null, 4));
				//console.log("s-Data " + JSON.stringify(stats, null, 4));
				res.render('levels/levels', { 
					title: title, 
					url: url,
					pdata: pdata,
					menusul: uidata.ul,
					config: config
					});
				});
			});
		}
	else {
		res.redirect("/profile" );
		}
	});

module.exports = router;





