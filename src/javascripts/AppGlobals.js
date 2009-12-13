/**
 * @fileOverview App global package.
 * @author <a href="http://decafbad.com">l.m.orchard@pobox.com</a>
 * @version 0.1
 */
/*jslint laxbreak: true */
/*global Mojo, $L, $H, SimpleDateFormat */
var AppGlobals = (function () { /** @lends AppGlobals */

    return {

        net_bunnies_url: "http://www.rabbit.org/fun/net-bunnies.html",

        app_menu_items: [
            Mojo.Menu.editItem
            //{ label: "Preferences...", command: 'AppPreferences' },
            //{ label: "About", command: 'AppAbout' }
            //{ label: "Help", command: 'AppHelp' }
        ],

        /**
         * Iniitalize the app global package on launch
         */
        init: function (launch_params) {
            // this.api = new FlickrUploadr.API();

            var fw_config = Mojo.Environment.frameworkConfiguration;
            this.tests_enabled = 
                fw_config.testsEnabled || launch_params.testsEnabled;
            this.run_tests_at_launch = 
                fw_config.runTestsAtLaunch || launch_params.runTestsAtLaunch;

            if (this.tests_enabled) {
                this.setupTests();
            }

            this.app_menu = {
                model: { visible: true, items: this.app_menu_items },
                attr: { omitDefaultItems: true }
            };

            return this;
        },

        /**
         * Set up tests, if enabled.
         */
        setupTests: function () {
            // Hijack TestAssistant.updateResults to generate more logging
            // spew in console.
            var orig_fn = Mojo.Test.TestAssistant.prototype.updateResults;
            /** @ignore */
            Mojo.Test.TestAssistant.prototype.updateResults = function () {
                Mojo.log("Reporting test results...");
                orig_fn.apply(this);
                // TODO: Include the suite name here
                this.resultsModel.items.each(function(item) {
                    Mojo.log("    %s: %s", item.method, item.message);
                }.bind(this));
                Mojo.log("Tests complete @ " + 
                    Mojo.Format.formatDate(new Date(), {time: 'medium'}));
                Mojo.log("Summary: %s", this.makeSummary(this.runner.results));
            };

            this.app_menu_items.push(
                { label: "Run Tests...", command: 'AppTests' }
            );
            this.app_menu_items.push(
                { label: "Dev Scene...", command: 'AppDev' }
            );
        },

        EOF: null
    };

}());
