define('module', ['moduleLoaderUtils', 'debug'], function (utils, debug) {
	'use strict';
	
	return {
		parseName: utils.parseModuleName,
		normalize: function(name, normalize){

			return utils.normalizePath(normalize(name));
		},
		load: function (name, req, onload) {
			name = this.parseName(name, req);
			name = utils.normalizePath(name);
			if (debug){
				name = req.toUrl(name);
			}
			
			req([name], function (value) {
				onload(value);
			});

		}
	};
});