/*global define: true, sinon: true, requireConfig: true, $: true, require: true, waitsFor: true */

window.TestContext = (function () {
	'use strict';
	
    var cnt = 0;

    function createContext(module, stubs) {
        cnt++;
        var map = {};

        var i18n = stubs.i18n,
            config = $.extend({}, requireConfig);


        stubs.i18n = {
            load: sinon.spy(function (name, req, onLoad) {
                onLoad(i18n);
            })
        };

        $.each(stubs, function (key, value) {
            var stubName = 'stub' + key + cnt;

            map[key] = stubName;

            define(stubName, function () {
                return value;
            });
        });


        config.context = 'context_' + cnt;
        config.map = {};
        config.map[module] = map;
        config.baseUrl = '../../main/webapp/app';
        return require.config(config);
    }

    function loadWithStubDependencies(module, stubs) {
        var testee, isLoaded = false;
        createContext(module, stubs)([module], function (stubbedModule) {
            testee = stubbedModule;
            isLoaded = true;
        });
        function isLoadedFun() {
            return isLoaded;
        }

        return {
            getModule: function () {
                console.log('--------before wait--------');
                waitsFor(isLoadedFun, module + ' not loaded', 10000);
                console.log('--------after wait testee: ', testee, '--------');
                return {
                    module: function () {
                        return testee;
                    },
                    isLoaded: isLoadedFun
                };
            }
        };
    }

    return {
        loadWithStubDependencies: loadWithStubDependencies
    };
}());
