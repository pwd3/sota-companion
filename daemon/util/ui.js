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

//var async = require('async');
function mnusetul(menus) {
	var ret = ''
	menus.forEach(function(m) {
		//console.log("menu itme = %j", m);
		if(m.sub) {
			ret += `	<li> <a href='${m.url}' data-icon="${m.icon}"> ${m.title} </a> `
			ret += '<ul>';
			ret += mnusetul(m.sub);
			ret += '</li></ul>';
			}
		else {
			ret += `	<li> <a href='${m.url}' data-icon="${m.icon}"> ${m.title} </a> </li>`
			}
		});
	return ret;
	}
module.exports = {

	getui: function(req, setter) {
		var config = req.app.get('config');
		var menus = req.app.get('menus');
		//console.log("MENUS = %j", menus);
		var url = req.protocol + '://' + req.get('host') + req.originalUrl;

		//var logger = req.app.get('logger');
		//var logloc = 'model/menus:getmenu';
		var ul = "<ul id='menu-ul'> ";

		ul += mnusetul(menus);
		ul += "</ul> ";
		setter({mnu: menus, ul: ul});
		}
	};

