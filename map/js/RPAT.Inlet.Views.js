RPAT.module('Inlet.Views', function(Views, App, Backbone, Marionette, $, _) {

    // RPAT List Item View
    // -------------------
    //
    // Display an individual inlet item, and respond to an
    // item being selected.

    Views.InletInfoView = Backbone.Marionette.ItemView.extend({
        template: '#template-inletInfoView'
    });
});
