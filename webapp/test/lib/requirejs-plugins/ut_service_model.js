define('ut_service_model', {
	normalize: function(name, normalize){
		return name + '|' + parseInt( (Math.random() * 10000), 10);
	},
	toURL: function(name, req, config){
		var tmp = name.split('/'),
			moduleName = tmp.splice(0,1)[0].replace('\\', '/'),
			modelPath = tmp.join('/'),
			url = req.toUrl( 'services/' + moduleName + '/models/' + modelPath + '.js' )
		;

		return url;
	},
	load: function (name, req, onload, config) {
		name = name.split('|')[0];
		req([this.toURL(name, req, config)], function (value) {
			onload(value);
		});
	}
});
