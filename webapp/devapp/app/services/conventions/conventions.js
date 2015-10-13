define([
	'./conventions/moduleViewConvention.js',
	'./conventions/widgetConvention.js',
	'./conventions/fixConsoleLogging.js',
	'./conventions/dialogConvention.js'
], function(moduleViewConvention, widgetConvention, fixConsoleLogging, dialogConvention){

	'use strict';

	return {
		useModuleViewConvention: moduleViewConvention,
		useWidgetConvention: widgetConvention,
		fixConsoleLogging: fixConsoleLogging,
		dialogConvention: dialogConvention
	};
});