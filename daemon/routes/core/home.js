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
	var statlist = [
		{
			key: "AdventurerLevel",
			label: "Adventurer Level"
		},
		{
			key: "ProducerLevel",
			label: "Producer Level"
		},
		{
			key: "Focus",
			label: "Focus"
		},
		{
			key: "Health",
			label: "Health"
		},
		{
			key: "CarryCapacity",
			label: "Carry Capacity"
		},
		{
			key: "Intelligence",
			label: "Intelligence"
		},
		{
			key: "Strength",
			label: "Strength"
		},
		{
			key: "FocusRegen",
			label: "Focus Regen"
		},
		{
			key: "CombatFocusRegen",
			label: "Combat Focus Regen"
		},
		{
			key: "HealthRegen",
			label: "Health Regen"
		},
		{
			key: "CombatHealthRegen",
			label: "Combat Health Regen"
		},
		{
			key: "CurrentFocus",
			label: "Current Focus"
		},
		{
			key: "CurrentHealth",
			label: "Current Health"
		},
		{
			key: "MiningLevel",
			label: "Mining Level"
		},
		{
			key: "ForestryLevel",
			label: "Forestry Level"
		},
		{
			key: "AgricultureLevel",
			label: "Agriculture Level"
		},
		{
			key: "FieldDressingLevel",
			label: "Field Dressing Level"
		},
		{
			key: "ForagingLevel",
			label: "Foraging Level"
		},
		{
			key: "BlacksmithingLevel",
			label: "Blacksmithing Level"
		},
		{
			key: "AlchemyLevel",
			label: "Alchemy Level"
		},
		{
			key: "TailoringLevel",
			label: "Tailoring Level"
		},
		{
			key: "CarpentryLevel",
			label: "Carpentry Level"
		},
		{
			key: "CookingLevel",
			label: "Cooking Level"
		},
		{
			key: "ButcheryLevel",
			label: "Cooking Level"
		},
		{
			key: "MillingLevel",
			label: "Milling Level"
		},
		{
			key: "SmeltingLevel",
			label: "Smelting Level"
		},
		{
			key: "TanningLevel",
			label: "Tanning Level"
		},
		{
			key: "TextilesLevel",
			label: "Textiles Level"
		},
		{
			key: "FishingLevel",
			label: "Fishing Level"
		},
		{
			key: "AlchemyEnchantmentLevel",
			label: "Alchemy Enchantment Level"
		},
		{
			key: "MasterworkBladeLevel",
			label: "Masterwork Blade Level"
		},
		{
			key: "MasterworkChainArmorLevel",
			label: "Masterwork Chain Armor Level"
		},
		{
			key: "MasterworkPlateArmorLevel",
			label: "Masterwork Plate Armor Level"
		},
		{
			key: "MasterworkShieldLevel",
			label: "Masterwork Shield Level"
		},
		{
			key: "MasterworkBludgeonLevel",
			label: "Masterwork Bludgeon Level"
		},
		{
			key: "MasterworkPolearmLevel",
			label: "Masterwork Polearm Level"
		},
		{
			key: "MasterworkRangedLevel",
			label: "Masterwork Ranged Level"
		},
		{
			key: "MasterworkClothArmorLevel",
			label: "Masterwork Cloth Armor Level"
		},
		{
			key: "MasterworkLeatherArmorLevel",
			label: "Masterwork Leather Armor Level"
		}
		];


	if(fs.existsSync(config.datadir + '/ChatLogs/')) {
		ui.getui(req, function(uidata) {
			var title = 'S-O-T-A Companion';
			playerloc.parse(req, function(pdata) {
				playerid = pdata.data.playerid;
				//db.loadCollections(['avatars', 'stats-' + playerid]);
				//console.log("P-Data " + JSON.stringify(pdata, null, 4));
				var avdata = db.avatars.findOne({playerid: playerid});
				var stats = {};
				if(avdata.laststat) stats = db['stats-' + playerid].findOne({when: avdata.laststat});
				//console.log("s-Data " + JSON.stringify(stats, null, 4));
				res.render('core/home', { 
					title: title, 
					url: url,
					pdata: pdata,
					laststat: avdata.laststat,
					stats: stats,
					statlist: statlist,
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




