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

// Dirty processing MUST be before any setting of isdirty
var isdirty = false;

window.onbeforeunload = checkdirty;
function checkdirty(){
	if(isdirty) {
		return "You have unsaved changes.";
		}
	}

