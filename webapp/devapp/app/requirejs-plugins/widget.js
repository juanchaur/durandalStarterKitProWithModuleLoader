define('widget', ['moduleLoaderUtils'], function (utils) {
	'use strict';

	return {
		parseName: function(name){
			if(name.indexOf('widgets/') === -1){
				var tmp = name.split('/'),
					moduleName = tmp[0],
					widgetName = tmp[1]
				;

				if(!widgetName){
					widgetName = moduleName;
					return 'widgets/' + widgetName + '/' + widgetName + 'Widget';
				}else{
					return 'modules/' + moduleName + '/widgets/' + widgetName + '/' + widgetName + 'Widget';
				}
			}else{
				return name;
			}
		},
		normalize: function(name, normalize){
			return this.parseName(normalize(name));
		},
		load: function(name, req, onload){
			name = utils.normalizePath(this.parseName(name));
			req([name], function (value) {
				onload(value);
			});
		}
	};
});