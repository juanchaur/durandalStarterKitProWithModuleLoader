define([], function() {

	'use strict';

	var routes = [
			{
				route: '',
				title: 'Welcome',
				moduleId: 'module!welcome',
				nav: true
			},
			{
				route: 'flickr',
				title: 'Flickr',
				moduleId: 'module!flickr',
				nav: true
			}
		],

		subroutes = [
			//To complete
		]
	;

	return {
		routes : routes,
		subroutes : subroutes
	};

});