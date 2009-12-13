/**
 * @fileOverview Home scene assistant
 * @author <a href="http://decafbad.com">l.m.orchard@pobox.com</a>
 * @version 0.1
 */
/*jslint laxbreak: true */
/*global Decafbad, FlickrUploadr, Mojo, $, $L, $A, $H, SimpleDateFormat */
function HomeAssistant() {
}

HomeAssistant.prototype = (function () { /** @lends HomeAssistant# */

    return {

        /**
         * Setup the application.
         */
        setup: function () {
            Decafbad.Utils.setupLoadingSpinner(this);

            // Make an initial porn fetch.
            this.fetchPorn();
        },

        /**
         * React to card activation.
         */
        activate: function (ev) {
            Decafbad.Utils.setupListeners([
                ['pornhere', Mojo.Event.tap, this.fetchPorn],
                ['pornholder', Mojo.Event.tap, this.fetchPorn],
                [this.controller.document, Mojo.Event.tap, this.fetchPorn],
                [this.controller.document, 'shaking', this.fetchPorn]
            ], this);
        },

        fetchPorn: function () {

            Decafbad.Utils.showLoadingSpinner(this);

            var req = new Ajax.Request(AppGlobals.net_bunnies_url, {
                method: 'GET',
                onSuccess: function (t) {
                    /*
                     * This is a dirty, dirty scraper hack.  But, it'll work
                     * until they change their page.
                     */
                    var img_url = (''+t.responseText)
                        .split("\n")
                        .filter(function (s) { return /\/netbunnies\//.test(s) })[0]
                        .split(/"/)[1];

                    //Mojo.log("BUNNIES URL %j", img_url);

                    var ph = this.controller.get('pornhere');

                    ph.onload = function () {
                        Decafbad.Utils.hideLoadingSpinner(this);
                    }.bind(this);

                    ph.src = img_url;

                }.bind(this)
            });

        },

        /**
         * React for card deactivation.
         */
        deactivate: function (ev) {
            Decafbad.Utils.clearListeners(this);
        },

        /**
         * Handle ultimate card clean up.
         */
        cleanup: function (ev) {
        },

        /**
         * Menu command dispatcher.
         */
        handleCommand: function (event) {
            if(event.type !== Mojo.Event.command) { return; }
            var func = this['handleCommand'+event.command];
            if (typeof func !== 'undefined') {
                return func.apply(this, [event]);
            }
        },

        /**
         * Show the about dialog.
         */
        handleCommandMenuAbout: function () {
            this.controller.showAlertDialog({
                onChoose: function(value) {},
                title: $L("Bunny Porn!"),
                message: [
                    "http://decafbad.com/"
                ].join('\n'),
                choices: [
                    {label:$L("OK"), value:""}
                ]
            });
        },

        EOF:null
    };
}());
