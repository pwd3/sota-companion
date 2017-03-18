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

////////////////////////////////////////////////////////////////
$(document).ready(function() {
	var table = $('#hits').DataTable( {
		ajax: '/hits/ajax/hits',
		colReorder: true,
		fixedColumns: true,
		fixedHeader: true,
		"order": [[1, 'desc']],
		responsive: true,
		scrollY: '60vh',
		scrollCollapse: true,
		paging: false,
		//lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
		//scrollX: true,
		dom: 'Bfrtip',
		buttons: [
			{
				extend: 'colvis',
				autoClose: true,
				text: 'Columns',
				postfixButtons: [ 
					{
						text: 'Restore Default',
						extend: 'colvisRestore' 
						}
					]
				},
			{
				extend: 'copyHtml5',
				exportOptions: {
					columns: ':visible'
					}
				},
			{
				extend: 'csvHtml5',
				exportOptions: {
					columns: ':visible'
					}
				},
			{
				extend: 'print',
				exportOptions: {
					columns: ':visible'
					}
				}
			],
		columns: [
			{ 
				"visible": true,
				data: "rwhen" 
				},
			{ 
				"visible": true,
				data: "when" 
				},
			{ 
				"visible": true,
				data: "target" 
				},
			{ 
				"visible": true,
				data: "attack" 
				},
			{ 
				"visible": true,
				data: "damage" 
				},
			{ 
				"visible": false,
				data: "by" 
				}
			]
		});
	});



