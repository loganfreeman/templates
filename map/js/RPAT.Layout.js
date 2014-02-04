RPAT.module('Layout', function(Layout, App, Backbone, Marionette, $, _) {

    // Layout Sidebar View
    // -------------------

    Layout.Sidebar = Backbone.Marionette.Layout.extend({
        template: '#template-sidebar',

        regions: {
            inletSearch: '#inlet-search',
            surveyList: '#survey-list',
            inletInfo: '#inlet-info'
        }
    });
});