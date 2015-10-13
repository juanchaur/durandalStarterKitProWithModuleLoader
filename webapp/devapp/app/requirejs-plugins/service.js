define('service', ['moduleLoaderUtils', 'debug'], function (utils, debug) {
	'use strict';
	
	return {
		parseName: utils.parseServiceName,
		parseOldName: function(name){
			if(name.indexOf('services/') === -1){
				// service!keyboard -> services/keyboard/keyboard.js
				// service!db/driver.sqlite3 -> services/db/driver.sqlite3.js
				return 'services/' +
				utils.parseName(name, '/') + '.js';
			}else{
				return name;
			}
		},
		normalize: function(name, normalize){
			var parsedName = this.parseName(name);
			var normalized = normalize(parsedName);
			return normalized;
		},
		load: function (name, req, onload) {
			if (debug){
				name = req.toUrl(name);
			}

			req([name], function (value) {
				onload(value);
			});
		}
	};
});