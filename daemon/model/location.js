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

var fs = require('fs');
var xml2js = require('xml2js');
var cc = require('change-case');
var moment = require('moment');

var self = {
	parse: function(req, setter) {
		var parser = new xml2js.Parser();
		var config = req.app.get('config');

		var rdata = {
			found: false,
			reason: "Data Directory Not Configured",
			data: {} 
			};
		if(config.datadir) {
			fs.readFile(config.datadir + '/CurrentPlayerData.xml', function(err, data) {
				if(err) {
					rdata.reason = `ERROR IN CurrentPlayerData.xml read (${err})`;
					setter(rdata);
					}
				else {
					parser.parseString(data, function (err, result) {
						if(err) {
							rdata.reason = `ERROR IN XML parse (${err})`;
							setter(rdata);
							}
						else {
							rdata.found = true,
							rdata.reason = `Good Read`;
							rdata.data = result;
							rdata.data.playerid = cc.lowerCase(result.character['$'].name.replace(/\s/g,'_')); 
							rdata.data.avatar = result.character['$'].name;
							rdata.data.x = result.character.loc_x[0];
							rdata.data.y = result.character.loc_y[0];
							rdata.data.z = result.character.loc_z[0];
							rdata.data.file = result.character.map_file[0];
							rdata.data.map = result.character.map_friendly[0];
							var mtime = fs.statSync(config.datadir + '/CurrentPlayerData.xml').mtime;
							rdata.data.when = moment(mtime).format('YYYY-MM-DD HH:mm:ss');
							var soon = moment().subtract(15,'seconds').format('YYYY-MM-DD HH:mm:ss');
							rdata.data.current = false;
							if(rdata.data.when > soon) rdata.data.current = true;
							setter(rdata);
							}
						});
					}
				});
			}
		else {
			setter(rdata);
			}
		}
	}
module.exports = self;
