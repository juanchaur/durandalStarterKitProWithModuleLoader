
define([
    'module!shell'
], function(
    shell
) {

    'use strict';

    describe('Module: Shell', function() {
        it('should have a "router" property', function() {
            expect(shell.router).toBeDefined();
        });

        it('should have a "search" property of type function', function() {
            expect(shell.search).toBeDefined();
        });

        describe('activate', function() {

            it('should be a property of type function', function() {
                expect(shell.activate).toBeDefined();
            });

            it('should return a promise  ', function() {
                expect(shell.activate().then).toBeDefined();
            });

        });
    });
});
