/*
 *     (c) 2013-2014 Daniel Goberitz.
 *     Modules loader may be freely distributed under the MIT license.
 *     For all details and documentation:
 *     https://www.github.com/danyg/modulesLoader
 *
 * @license ModulesLoader 0.4.0 Copyright (c) 2013-2014 Daniel Goberitz
 * @author Daniel Goberitz <dalgo86@gmail.com>
 *
 * Available via the MIT license.
 */
define(function(){
	'use strict';

	function parseName(name, glue){
		var tmp = name.split('/');
		if(tmp.length === 1){
			name = name + glue + name;
		}else if(tmp.length >= 2){
			var m = tmp.splice(0,1);
			name = m + glue + tmp.join('/');
		}else if(tmp.length > 2){
			throw new URIError('Ilegal module! or service! name \'' + name + '\'');
		}

		return name;
	}

	function parseModuleName(name){
		if(name.indexOf('modules/') === -1){
			// module!projects -> modules/projects/controllers/projects.js
			// module!projects/projectDetails -> modules/projects/controlers/projectDetails.js
			return 'modules/' + parseName(name, '/controllers/') + '.js';
		}else{
			return name;
		}
	}
	/**
	 * service![NameOfService]/[NameOfService].js
	 * service![internalFolder]/[NameOfService]/[NameOfService].js
	 */
	function parseServiceName(name){
		
		if(name.indexOf('services/') === -1){
			
			var tmp = name.split('/');
			if(tmp.length === 1 || tmp.length > 2){
				name = parseName(name, '/');
			} else if (tmp.length === 2) {
				name = name + '/' + tmp[1];
			}
			
			return 'services/' + name +  '.js';
			
		}else{
			return name;
		}
	}

	function isAbsolutePath(path) {
		return path.charAt(0) === '/';
	}

	function normalizeArray(parts, allowAboveRoot) {
		// if the path tries to go above the root, `up` ends up > 0
		var up = 0;
		for (var i = parts.length - 1; i >= 0; i--) {
			var last = parts[i];
			if (last === '.') {
				parts.splice(i, 1);
			} else if (last === '..') {
				parts.splice(i, 1);
				up++;
			} else if (up) {
				parts.splice(i, 1);
				up--;
			}
		}

		// if the path is allowed to go above the root, restore leading ..s
		if (allowAboveRoot) {
			for (; up--; up) {
				parts.unshift('..');
			}
		}

		return parts;
	}

	function normalizePath(path){
		var isAbsolute = isAbsolutePath(path),
			trailingSlash = path[path.length - 1] === '/',
			segments = path.split('/'),
			nonEmptySegments = [];

		// Normalize the path
		for (var i = 0; i < segments.length; i++) {
			if (segments[i]) {
				nonEmptySegments.push(segments[i]);
			}
		}
		path = normalizeArray(nonEmptySegments, !isAbsolute).join('/');

		if (!path && !isAbsolute) {
			path = '.';
		}
		if (path && trailingSlash) {
			path += '/';
		}

		path = path.replace(/\\/g, '/');

		return (isAbsolute ? '/' : '') + path;
	}

	require.modulePath = function(moduleWithSufix){
		if(moduleWithSufix.indexOf('module!') === 0){
			moduleWithSufix = moduleWithSufix.substring(7);
		}
		return parseModuleName(moduleWithSufix);
	};

	// kind --> insider Directory
	var InsiderKinds = {
		'model': 'models/',
		'view': 'views/',
		'template': 'templates/',
		'helper': 'helpers/',
		'widget': 'widgets/'
	};

	function normalizeInsider(name, normalize, kind, enableForServices){
		if (name.indexOf('modules') === 0 || name.indexOf('services') === 0) {
			return name;
		}
		var currentPath = normalize('./'),
			root
		;
			
		root = enableForServices === true ?
			currentPath.match(/(.*modules\/[^\/]*\/)|(.*services\/[^\/]*\/)/) :
			currentPath.match(/(.*modules\/[^\/]*\/)/)
		;

		if(root && (root[1] || root[2])){
			var rPath = (root[1] || root[2]);
			if(name.indexOf(rPath) === -1){
				return rPath + InsiderKinds[kind] + name + '.js';
			}else{
				return name;
			}
		}else{
			throw new URIError(kind + '!' + name + ' unreachable from ' + normalize('./'));
		}
	}

	return {
		parseModuleName: parseModuleName,
		parseServiceName: parseServiceName,
		parseName: parseName,
		normalizePath: normalizePath,
		normalizeInsider: normalizeInsider
	};
});