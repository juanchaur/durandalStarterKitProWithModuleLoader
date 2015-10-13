define([
	'knockout',
	'durandal/activator',
	'durandal/events',
	'durandal/system'
], function(
	ko,
	activator,
	events,
	system
) {

	'use strict';

	var activeItem = activator.create();

	var router = {
		_stubProps: {
			currentActivation: '',
			currentInstruction: '',
			activateDefered: null
		},

		handlers: [],
		routes: [],
		navigationModel: ko.observableArray([]),
		activeItem: activeItem,
		isNavigating: ko.observable(true),
		activeInstruction:ko.observable({
			fragment:'account/mock_reinstateSpendDebtRestrictedTP/bill',
			queryString:null,
			'config':{
				route:'account/:accountNumber*subRoute',
				moduleId:'module!accounts',
				nav:100,
				title:'Accounts',
				hash:'#account/:accountNumber*subRoute',
				routePattern:{},
				oneColumn: false
			},
			params:[
				'mock_reinstateSpendDebtRestrictedTP',
				'/bill'
			],
			queryParams:null
		}),
		__router__:true,


		parseQueryString: function() {
			var queryObject, pairs;

			if (!queryString) {
				return null;
			}

			pairs = queryString.split('&');

			if (pairs.length === 0) {
				return null;
			}

			queryObject = {};

			for (var i = 0; i < pairs.length; i++) {
				var pair = pairs[i];
				if (pair === '') {
					continue;
				}

				var parts = pair.split('=');
				queryObject[parts[0]] = parts[1] && decodeURIComponent(parts[1].replace(/\+/g, ' '));
			}

			return queryObject;
		},
		attached: function() {
			this.trigger(
				'router:navigation:attached',
				this._stubProps.currentActivation,
				this._stubProps.currentInstruction,
				this
			);
		},
		compositionComplete: function() {
			this.trigger(
				'router:navigation:composition-complete',
				this._stubProps.currentActivation,
				this._stubProps.currentInstruction,
				this
			);
		},
		convertRouteToHash: function(route) {
			return '#' + route;
		},
		convertRouteToModuleId: function(route){
			var colonIndex = route.indexOf(':');
			var length = colonIndex > 0 ? colonIndex - 1 : route.length;
			return route.substring(0, length);
		},
		convertRouteToTitle: function() {
			var value = stripParametersFromRoute(route);
			return value.substring(0, 1).toUpperCase() + value.substring(1);
		},
		activate: function(){
			var dfd = system.defer();
			this._stubProps.activatePromise = dfd;
			return dfd.promise();
		}
	};

	events.includeIn(router);

	function createOrResetStub(listOfMethods){
		var method;
		for(var i = 0; i < listOfMethods.length; i++){
			method = listOfMethods[i];
			if(!router[method] || !router[method].reset) {
				sinon.stubOnHot(router, method);
			} else if(!!router[method] && !!router[method].reset) {
				router[method].reset();
			}
		}
	}

	function stubIt() {

		createOrResetStub([
			'route',
			'loadUrl',
			'updateDocumentTitle',
			'navigate',
			'navigateBack',
			'attached',
			'convertRouteToHash',
			'map',
			'buildNavigationModel',
			'mapUnknownRoutes',
			'reset',
			'makeRelative',
			'createChildRouter',
			'deactivate',
			'install'
		]);

		router.navigate.returns(true);
		router.map.returns(router);
		router.buildNavigationModel.returns(router);
		router.mapUnknownRoutes.returns(router);
		router.reset.returns(router);
		router.makeRelative.returns(router);
		router.createChildRouter.returns(router);
	}

	beforeEach(function() {

		stubIt();

	});

	stubIt(); // for definition time!


	return router;
});