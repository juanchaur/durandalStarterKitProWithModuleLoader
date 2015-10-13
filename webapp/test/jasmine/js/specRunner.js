/*global requireConfig: true, console: true, require: true */

if (typeof console === 'undefined') {
    console = { log: function () {} };
}

requireConfig={
	
	baseUrl: '../../main/webapp/app',

    paths: {
        'text': '../scripts/requirejs-text/text',
        //'moment': '../scripts/moment/moment',
        'jquery': '../scripts/jquery/jquery-1.10.2',
        'jasmine': '../../../test/jasmine/lib/jasmine-1.3.1/jasmine',
        'jasmine-html': '../../../test/jasmine/lib/jasmine-1.3.1/jasmine-html',
        'jasmine-jquery': '../../../test/jasmine/lib/jasmine-1.3.1/jasmine-jquery',
        'phantomReporter': '../../../test/lib/jasmine-reporters/jasmine.phantomjs-reporter',
        'phantomCoreUtils': '../../../test/lib/utils/core',
        'sinon': '../../../test/jasmine/lib/sinon-1.7.3',
        //'amplify': '../scripts/amplify/amplify',
        //'spin': '../scripts/spinjs/spin',

        durandal: '../scripts/durandal/js',
        plugins: '../scripts/durandal/js/plugins',
        transitions: '../scripts/durandal/js/transitions',
        knockout: '../scripts/knockout.js/knockout-3.0.0.debug',
        //'knockout.validation': '../scripts/knockout.validation/knockout.validation',
        //'knockout.delegatedEvents': '../scripts/knockout.delegratedEvents/knockout-delegratedEvents',
        //bootstrap: '../scripts/bootstrap/js',

        //spinjs: '../scripts/spinjs/spin',
        //toastr: '../scripts/toastr/toastr',
        //'amplify.request.deferred': '../scripts/amplify/amplify.request.deferred',
        //jsonpi: '../scripts/jquery.jsonpi',

        modulesLoader : '../scripts/requirejs-moduleLoader/moduleLoader'

    },

    shim: {
        'jasmine': {
            exports: 'jasmine'
        },
        'phantomReporter': ['jasmine'],
        'phantomCoreUtils': ['phantomReporter'],
        'jasmine-html': {
            deps: ['jasmine'],
            exports: 'jasmine'
        },
        'jasmine-jquery': {
            deps: ['jquery', 'jasmine'],
            exports: 'jasmine.JQuery'
        },
        /*'bootstrap': {
            deps: ['jquery'],
            exports: 'jQuery'
        },
        'knockout.validation': {
            deps: ['knockout'],
            exports: 'knockout.validation'
        },
        'knockout.delegatedEvents': ['knockout'],

        'amplify': {
            deps: ['jquery'],
            exports: 'amplify'
        },
        'amplify.request.deferred': {
            deps: ['jquery','amplify'],
            exports: 'amplify'
        }
        */
    },


    config: {
        globals: {
            context: '/somepath',
            environment: 'someenv',
            appVersion: 'v1.0.0',
            commsServer: 'commServ',
            commsServerUser: 'commUser',
            commsServerPassword: 'commPassword',
            commsServerDomain: 'xmppdomain',
            debug: 'true'
        }
    }


};

require.config(requireConfig);

require(['jasmine', 'jasmine-html', 'jasmine-jquery', 'phantomReporter',
    'phantomCoreUtils', 'sinon'], function(jasmine) {

    'use strict';

    var jasmineEnv, htmlReporter, specs;

    jasmine.getJSONFixtures().fixturesPath = 'spec/fixtures/json';

    jasmineEnv = jasmine.getEnv();
    jasmineEnv.updateInterval = 1000;

    htmlReporter = new jasmine.HtmlReporter();

    // jasmineEnv.addReporter(new jasmine.TrivialReporter());
    jasmineEnv.addReporter(new jasmine.PhantomJSReporter(false));
    jasmineEnv.addReporter(htmlReporter);

    jasmineEnv.specFilter = function(spec) {
        return htmlReporter.specFilter(spec);
    };

    specs = [];

    String.prototype.trunc = function (maxlen, useWordBoundary) {
        var str, tooLong;
        tooLong = this.length > maxlen;
        str = tooLong ? this.substr(0, maxlen - 1) : this;
        str = useWordBoundary && tooLong ? str.substr(0, str.lastIndexOf(' ')) : str;
        return tooLong ? str + '&hellip;' : str;
    };

    if (typeof String.prototype.trim !== 'function') {
        String.prototype.trim = function () {
            return this.replace(/^\s+|\s+$/g, '');
        };
    }

    if (typeof String.prototype.startsWith !== 'function') {
        String.prototype.startsWith = function (str){
            return this.slice(0, str.length) === str;
        };
    }

    if (typeof String.prototype.endsWith !== 'function') {
        String.prototype.endsWith = function (str) {
            return this.slice(-str.length) === str;
        };
    }

    $(function () {
        require(specs, function () {
            console.log('execute');
            jasmineEnv.execute();
            $('body').animate({ scrollTop: $(document).height() }, 'fast').animate({ scrollTop: 0 }, 'slow');
        });
    });

});
