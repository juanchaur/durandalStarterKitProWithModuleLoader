;(function() {

	'use strict';

	//Requirejs Configuration
	requirejs.config({
		paths: {
			//requirejs plugins
			text: '../lib/require/text',

			//moduleLoader
			moduleLoaderUtils: 'requirejs-plugins/moduleLoaderUtils',
			module: 'requirejs-plugins/module',
			model: 'requirejs-plugins/model;',
			view: 'requirejs-plugins/view',
			widget: 'requirejs-plugins/widget',
			service: 'requirejs-plugins/service',
			helper: 'requirejs-plugins/helper',


			durandal: '../lib/durandal/js',
			plugins : '../lib/durandal/js/plugins',
			transitions: '../lib/durandal/js/transitions',
			knockout: '../lib/knockout/knockout-3.1.0',
			bootstrap: '../lib/bootstrap/js/bootstrap',
			jquery: '../lib/jquery/jquery-1.9.1',
			debug: 'conf/debugOn'
		},
		shim: {
			'bootstrap': {
				deps: ['jquery'],
			}
		},
		waitSeconds: 200
	});


	//Kickstart of the app
	define([
		'jquery',
		'durandal/system',
		'durandal/app',
		'debug',
		// 'text!versions',//TODO create vautomatic versioning
		'service!conventions',
		'bootstrap',
	],  function (
		$,
		system,
		app,
		debug,
		// versionProps,
		conventions
	) {
		var versionNumber,
			buildNumber
		;

		system.debug(debug);

		app.title = 'Durandal Starter Kit Pro + moduleLoader';

		app.configurePlugins({
			router:true,
			dialog: true,
			widget: true
		});

		//TODO: Create automatic versioning
		// versionNumber = versionProps.match(/app\.version=([^\n]*)/);
		// buildNumber = versionProps.match(/build\.timestamp=([^\n]*)/);
		// app.version = versionNumber[1] + ' @ ' + buildNumber[1];



		app.start().then(function() {

			conventions.useModuleViewConvention();
			conventions.useWidgetConvention();
			conventions.fixConsoleLogging();

			//Old way before moduleLoader
			//Replace 'viewmodels' in the moduleId with 'views' to locate the view.
			//Look for partial views in a 'views' folder in the root.
			//viewLocator.useConvention();


			//Show the app by setting the root view model for our application with a transition.
			app.setRoot('module!shell', 'entrance');
			//app.setRoot('viewmodels/shell', 'entrance');
		});
	});

}());
