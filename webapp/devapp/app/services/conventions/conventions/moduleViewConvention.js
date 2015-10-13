define(['durandal/viewLocator'], function(viewLocator){
	'use strict';

	function useConvention(){
		viewLocator.useConvention();

		// We change the convention to use the hMVC convention
		viewLocator.convertModuleIdToViewId = function(moduleId) {
			var viewId = moduleId;
			if (moduleId.indexOf('module!') !== -1) {
				viewId = require.modulePath(moduleId);
			}
			viewId = viewId.replace('/controllers/', '/templates/');
			viewId = viewId.replace('.js', '');

			return viewId;
		};
	}

	return useConvention;

});