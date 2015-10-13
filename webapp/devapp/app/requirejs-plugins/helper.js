define('helper',['moduleLoaderUtils'], function (utils) {
	'use strict';
	
	return {
		normalize: function(name, normalize){
			return utils.normalizeInsider(name, normalize, 'helper', true);
		},
		load: function (name, req, onload) {
			req([name], function (value) {
				onload(value);
			});
		}
	};
});