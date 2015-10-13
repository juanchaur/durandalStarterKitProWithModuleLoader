/*global module, require */
module.exports = function( grunt ) {
	'use strict';

	// Livereload and connect variables
	var LIVERELOAD_PORT = 35729;
	var lrSnippet = require('connect-livereload')({
		port: LIVERELOAD_PORT
	});

	var mountFolder = function( connect, dir ) {
		return connect.static(require('path').resolve(dir));
	};

	var mixIn = require('mout/object/mixIn');

	// configurable paths
	var webappConfig = {
		root: 'webapp',
		// app: 'webapp/app',
		app: 'webapp/devapp/app',
		test: 'webapp/test',
		lib: 'webapp/devapp/lib',
		css: 'webapp/devapp/css',
	};

	var requireConfig = {
		baseUrl: 'webapp/devapp/app',
		paths: {
			'text': '../lib/require/text',
			'durandal': '../lib/durandal/js',
			'plugins': '../lib/durandal/js/plugins',
			'transitions': '../lib/durandal/js/transitions',
			'knockout': '../lib/knockout/knockout-3.1.0',
			'bootstrap': '../lib/bootstrap/js/bootstrap',
			'jquery': '../lib/jquery/jquery-1.9.1',
		},
		shim: {
			'bootstrap': {
				deps: ['jquery'],
				exports: 'jQuery'
			}
		}
	};

	//RequireJs Configuration for the new JasmineTemplate (jasmineAlone + jasmineDurandal)
	// var pathDefinitionsTDD = grunt.file.readJSON('pathDefinitionsTDD.json');
	var pathDefinitionsTDD = {
		baseUrl: 'webapp/devapp/app',

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
			//moduleLoader specs helpers
			ut_helper: '../../test/lib/requirejs-plugins/ut_helper',
			ut_service_helper: '../../test/lib/requirejs-plugins/ut_service_helper',
			ut_model: '../../test/lib/requirejs-plugins/ut_model',
			ut_service_model: '../../test/lib/requirejs-plugins/ut_service_model',
			ut_view: '../../test/lib/requirejs-plugins/ut_view',

			//Libraries
			durandal: '../lib/durandal/js',
			plugins : '../lib/durandal/js/plugins',
			transitions: '../lib/durandal/js/transitions',
			knockout: '../lib/knockout/knockout-3.1.0',
			bootstrap: '../lib/bootstrap/js/bootstrap',
			jquery: '../lib/jquery/jquery-1.9.1',
			'debug': 'conf/debugOn',

			// TEST Libraries
			'sinon': '../../test/jasmine/lib/sinon-1.7.3',

			// Test utils
			'specHelper': '../../test/jasmine/js/specHelper',
			'require-css': '../../test/lib/utils/require-css',
			'jasmine-durandal': '../../test/lib/jasmine-durandal/jasmine-durandal-1.3x',
			'jasmine-alone': '../../test/jasmine/js/jasmine-alone',

			'routerStub': '../../test/jasmine/js/routerStub'
		},
		shim: {
			'bootstrap': {
				deps: ['jquery'],
			},
			'routerStub': {
				deps: ['sinon']
			}
		},
		map: {
			'*': {
				'plugins/router': 'routerStub'
			}
		}
	};


	grunt.initConfig({
		webapp: webappConfig,

		pkg: grunt.file.readJSON('package.json'),

		clean: {
			build: ['build/*']
		},

		connect: {
			build: {
				options: {
					port: 9001,
					hostname: 'localhost',
					base: 'build'
				}
			},
			dev: {
				options: {
					port: 8999,
					hostname: 'localhost',
					middleware: function( connect ) {
						return [lrSnippet, mountFolder(connect, '.')];
					}
				}
			}
		},

		copy: {
			lib: {
				src: '<%= webapp.lib %>/**/**',//'lib/**/**',
				dest: 'build/'
			},
			index: {
				src: 'index.html',
				dest: 'build/'
			},
			css: {
				src: '<%= webapp.lib %>/**/**',//'css/**',
				dest: 'build/'
			}
		},

		open: {
			dev: {
				path: 'http://localhost:<%= connect.dev.options.port %>/_SpecRunner.html',
				app: '/usr/bin/google-chrome-stable %U'
			},
			notest: {
				path: 'http://localhost:<%= connect.dev.options.port %>',
				app: '/usr/bin/google-chrome-stable %U'
			},
			build: {
				path: 'http://localhost:<%= connect.build.options.port %>',
				app: '/usr/bin/google-chrome-stable %U'
			}
		},

		durandal: {
			main: {
				src: [
					'<%= webapp.app %>/**/*.*',
					'<%= webapp.lib %>/durandal/**/*.js'
				],
				options: {
					name: '<%= webapp.lib %>/require/almond-custom',
					baseUrl: requireConfig.baseUrl,
					mainPath: '<%= webapp.lib %>/main',
					paths: mixIn({}, requireConfig.paths, { 'almond': '<%= webapp.lib %>/require/almond-custom.js' }),
					exclude: [],
					optimize: 'none',
					out: 'build/app/main.js'
				}
			}
		},

		jasmine: {
			dev: {
				src: '<%= webapp.app %>/**/*.js',//'app/viewmodels/*.js',
				options: {
					specs: '<%= webapp.test %>/specs/**/*.spec.js',
					keepRunner: true,
					// template: require('grunt-template-jasmine-requirejs'),
					template: require('./webapp/test/jasmine-custom-template/src/template-jasmine-requirejs.js'),
					templateOptions: {
						// requireConfig: requireConfig,
						requireConfig: pathDefinitionsTDD,
						//preloads: ['modulesLoader'],
						minified: false
					}
				}
			}
		},

		jshint: {
			all: ['Gruntfile.js', 'webapp/devapp/app/**/*.js', 'webapp/test/specs/**/*.js']
		},

		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n' +
					'* Copyright (c) <%= grunt.template.today("yyyy") %> YourName/YourCompany \n' +
					'* Available via the MIT license.\n' +
					'* see: http://opensource.org/licenses/MIT for blueprint.\n' +
					'*/\n'
			},
			build: {
				src: 'build/app/main.js',
				dest: 'build/app/main-built.js'
			}
		},

		watch: {
			build: {
				files: ['build/**/*.js'],
				tasks: ['jasmine:build']
			},
			dev: {
				files: [
					'webapp/test/specs/dev/**/*spec.js',
					'webapp/devapp/app/**/*.js'
				],
				tasks: ['jasmine:dev'],
				options: {
					livereload: true
				}
			}
		}
	});

// Loading plugin(s)
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-jasmine');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-open');
	grunt.loadNpmTasks('grunt-durandal');

	grunt.registerTask('notest', [
		'jshint',
		'connect:dev:livereload',
		'open:notest',
		'watch:dev'
	]);

	grunt.registerTask('default', [
		'jshint',
		//'jasmine:dev',
		'connect:dev:livereload',
		'open:dev',
		'watch:dev'
	]);

	grunt.registerTask('build', [
		'jshint',
		'jasmine:dev',
		'clean',
		'copy',
		'durandal:main',
		'uglify',
		'jasmine:build',
		'connect:build',
		'open:build',
		'watch:build'
	]);
};
