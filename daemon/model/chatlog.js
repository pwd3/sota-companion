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
var line = require('line-by-line');
var glob = require('glob');
var moment = require('moment');
var cc = require('change-case');
var async = require('async');
var db = require('diskdb');
var cp = require('glob-copy');
var debug = require('debug')('daemon:model-chatlog');

var cycle = 5000;

var seenfiles = {};
// NOTE this is the SAT AFTER last wipe, as chat uses local time
// for logging we need to worry about time zone
var lastwipe = '2016-07-30';
//TESTING
//var lastwipe = '2016-12-30';
var self = {
	parse: function(app, file, last, setter) {
		var config = app.get('config');
		var dbdir = app.get('dbdir');
		var lastseen = '2000-01-01';
		var avatar = file.replace(/_\d+-\d+-\d+.txt/,'');
		avatar = avatar.replace(/^.+_/,'');
		var playerid = cc.lowerCase(avatar.replace(/\s/g,'_'));
		db.loadCollections(['avatars', 
			'stats-' + playerid, 
			'hits-' + playerid, 
			'levels-' + playerid]);
		var playerre = new RegExp(avatar, 'g');

		//console.log("Processing File %j with last = %j",file, last);
		var retdata = {
			lastseen: '2000-01-01',
			laststat: '',
			avatar: avatar,
			playerid: playerid,
			stats: {}
			};


		lr = new line(file);
		lr.on('error', function(err) {
			//console.log("Got error on model/chatlog:parse %j",err);
			});
		var linedata = '';
		var goodline = true;
		lr.on('line', function(linematch) {
			if(linematch.match(/AdventurerLevel/) || (! goodline)) {	// WINDOWS continuation line
				if(goodline) linedata = '';
				//console.log("Got a windows continue line of %j",linematch);
				linedata = linedata + linematch.replace(/\r/gm,' ');
				goodline = false;
				}
			else {	// Normal WINDOWS OR unix type line
				linedata = linematch;
				goodline = true;
				}
			if (linematch.match(/HealModifier/)) {
				//console.log("Got a finish continue line of %j",linedata);
				goodline = true;
				}
			//console.log("got avatar of %j (%j)",avatar,playerid);
			//console.log("got linedata of %j",linedata);
			var mtc = linedata.match(/^\[[APM0-9:\/ -]+\]/);
			var when = '2001-01-01';
			if(mtc) {
				// some logs are 24 hour some are AM/PM
				when = moment(mtc[0],'MM-DD-YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
				if(linedata.match(/[AMP]/)) when = moment(mtc[0],'MM-DD-YYYY hh:mm:ss A').format('YYYY-MM-DD HH:mm:ss');
				//console.log("got a when of %j",when);
				}
			if(last < when && goodline) { // ONLY process lines where they are newer than the last seen (or OLD if doing init)
				if(retdata.lastseen < when) retdata.lastseen = when;
				if(linedata.match(/has increased to level/)) {
					var av = linedata.replace(/\'.+$/,'');
					av = av.replace(/^\[[APM0-9:\/ -]+\]\s+/,'');
					//console.log("avatar = %j got a level line of %j",av,linedata);
					if(av == avatar) {
						var sk = linedata.replace(/^[^\(]+\(/,'');
						var sk = sk.replace(/\).+$/,'');
						var lv = linedata.replace(/^.+level /,'');
						var lv = lv.replace(/!$/,'');
						var level = {
							skill: sk,
							when: when,
							direction: 'Increase',
							level: lv
							};
						db['levels-'+playerid].update({when: when},level,{upsert:true});
						}
					}
				else if(linedata.match(/and hits, dealing/)) {
					var by = linedata.match(/\] (.+) attacks /)[1];
					var target = linedata.match(/attacks (.+) and hits/)[1];
					var damage = linedata.match(/and hits, dealing (.+)/)[1];
					var attack = '';
					if(damage.match(/ from /)) {
						attack = damage.match(/from (.+)/)[1];
						damage = damage.replace(/from .+$/,'');
						}
					damage = damage.replace(/points of damage/,'');
					damage = damage.replace(/point of damage/,'');
					damage = damage.replace(/no damage/,'0');
					damage = damage.replace(/points of critical damage/,'Critical');
					damage = damage.replace(/\.$/,'');
					damage = damage.replace(/^\s+/,'');
					damage = damage.replace(/\s+$/,'');

					if(by.match(playerre)) {
						//console.log("got hits linedata %j ",linedata);
						//console.log("Attacker = %j",by);
						//console.log("Target = %j",target);
						//console.log("Damage = %j",damage);
						//console.log("Attack = %j",attack);
						var hit = {
							by: by,
							when: when,
							target: target,
							damage: damage,
							attack: attack
							};
						db['hits-'+playerid].update({when: when},hit,{upsert:true});
						}
					}
				else if(linedata.match(/^\[[AMP0-9:\/ -]+\]\s+AdventurerLevel:/)) {
					//console.log("got avatar of %j (%j)",avatar,playerid);
					//console.log("Got a date of %j",when);
					var st = linedata.replace(/^\[[0-9:\/ -]+\]\s+/,'');
					retdata.laststat = when;
					retdata.stats[when] = {
						when: when
						};
					st.match(/[A-Za-z]+:\s[0-9.]+/g).forEach(function(par) {
						var arr = par.split(/:\s+/);
						retdata.stats[when][arr[0]] = arr[1];
						});
					db['stats-'+playerid].update({when: when},retdata.stats[when],{upsert:true});
					}

				}
			});
		lr.on('end', function(linedata) {
			//console.log("End of %j",file);
			setter(retdata);
			});

		
		},
	process: function(app,done) {
		var config = app.get('config');
		var dbdir = app.get('dbdir');



		db.connect(dbdir);
		db.loadCollections(['avatars']);
		if(fs.existsSync(config.datadir + '/ChatLogs/')) {
			async.forEachLimit( glob.sync(config.datadir + '/ChatLogs/SotAChatLog_*') , 1, 
				function(f,callback) {
				var avatar = f.replace(/_\d+-\d+-\d+.txt/,'');
				avatar = avatar.replace(/^.+_/,'');
				var playerid = cc.lowerCase(avatar.replace(/\s/g,'_'));
				filedate = f.replace(/^.*_/,'');
				var mtime = fs.statSync(f).mtime;
				mtime = moment(mtime).format('YYYY-MM-DD HH:mm:ss');
				var doit = filedate >= lastwipe;
				//console.log(" go a filedata of %j (%j) doit = %j",filedate,lastwipe,doit);
				if(seenfiles[f]) {
					if(seenfiles[f] == mtime) doit = false;
					};
				seenfiles[f] = mtime;
				db.loadCollections(['avatars']);
				var avdata = db.avatars.findOne({playerid: playerid});
				if(! avdata) avdata = {};
				avdata.playerid = playerid;
				avdata.avatar = avatar;
				if(! avdata.lastseen) avdata.lastseen = lastwipe;
				if(! avdata.laststat) avdata.laststat = '';
				db.avatars.update({playerid: playerid},avdata,{upsert: true});
				if(doit) {
					debug("Will run parse on %j",f);
					self.parse(app,f, avdata.lastseen, function(d) {
						//console.log("P-Data " + JSON.stringify(d, null, 4));
						var playerid = d.playerid;
						// update the avatar collection
						if(avdata.lastseen < d.lastseen) avdata.lastseen = d.lastseen;
						if(avdata.laststat < d.laststat) avdata.laststat = d.laststat;
						//console.log("A-Data " + JSON.stringify(avdata, null, 4));
						db.avatars.update({playerid: playerid},avdata,{upsert: true});
						callback();
						});
					}
				else{
					callback();
					}
				},
				function(err) {
					if(err) {
					}
				done();
				});
			}
		},
	run: function(app) {
		var config = app.get('config');
		var dbdir = app.get('dbdir');
		self.process(app, function(){
			setTimeout(function() {
				sweepback = dbdir + '/sweep-' + moment().format('YYYY-MM-DD');
				debug("testing %j for sweep",sweepback);
				if(! fs.existsSync(sweepback)) {
					debug("Will run sweep for %j in %j msec",sweepback,cycle);
					self.runsweep(app,sweepback);
					}
				else {
					debug("Will run process in %j msec",cycle);
					self.run(app);
					}
				},cycle);
			});
		},
	runsweep: function(app,sweepback) {
		self.sweep(app,sweepback,function(){
			setTimeout(function() {
				self.run(app);
				},cycle);
			});
		},
	sweep: function(app,sweepback,done) {
		var dbdir = app.get('dbdir');
		var hitdays = 20;
		var statdays = 60;
		var leveldays = 600;
		var hitwhen = moment().subtract(hitdays,'days').format('YYYY-MM-DD');
		var statwhen = moment().subtract(statdays,'days').format('YYYY-MM-DD');
		var levelwhen = moment().subtract(leveldays,'days').format('YYYY-MM-DD');
		fs.existsSync(dbdir) || fs.mkdirSync(dbdir);
		fs.existsSync(sweepback) || fs.mkdirSync(sweepback);
		// make the sweep backup DEBUGING -- this copies all of the db into the sweep
		// directory, uncomment to debug
		//cp(dbdir + '/*.json', sweepback);
		var config = app.get('config');
		var dbdir = app.get('dbdir');
		db.connect(dbdir);
		db.loadCollections(['avatars']);
		var avdata = db.avatars.find();
		avdata.forEach(function(a){
			var playerid = a.playerid;
			debug("sweeping playerid %j",playerid);
			db.loadCollections([
				'stats-' + playerid, 
				'hits-' + playerid, 
				'levels-' + playerid]);
			var stats = db['stats-' + playerid].find();
			var hits = db['hits-' + playerid].find();
			var levels = db['levels-' + playerid].find();
			stats.forEach(function(s){
				origid = s._id;
				var swvar = {
					record: s,
					type: 'stats',
					when: s.when,
					partyid: playerid,
					origid: origid
					}
				delete swvar.record._id;
				//console.log("level " + JSON.stringify(swvar, null, 4));
				//db[sweepback].update({origid: origid},swvar,{upsert:true});
				if(s.when < levelwhen) db['stats-' + playerid].remove({_id: origid});
				});
			hits.forEach(function(h){
				origid = h._id;
				var swvar = {
					record: h,
					type: 'hit',
					when: h.when,
					partyid: playerid,
					origid: origid
					}
				delete swvar.record._id;
				//console.log("level " + JSON.stringify(swvar, null, 4));
				//db[sweepback].update({origid: origid},swvar,{upsert:true});
				if(h.when < levelwhen) db['hits-' + playerid].remove({_id: origid});
				});
			levels.forEach(function(l){
				origid = l._id;
				var swvar = {
					record: l,
					type: 'level',
					when: l.when,
					partyid: playerid,
					origid: origid
					}
				delete swvar.record._id;
				//console.log("level " + JSON.stringify(swvar, null, 4));
				//db[sweepback].update({origid: origid},swvar,{upsert:true});
				if(l.when < levelwhen) db['levels-' + playerid].remove({_id: origid});
				});
			});
		debug("done with sweep");
		done();
		}
	}
module.exports = self;

