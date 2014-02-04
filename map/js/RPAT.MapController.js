RPAT.module('MapController', function(MapController, App, Backbone, Marionette, $, _) {

    // Map Controller (Mediator)
    // ------------------------------
    //
    // Control the workflow and logic that exists at the application
    // level, above the implementation detail of views and models

    MapController.Controller = function() {};

    MapController.addInitializer(function(options) {
        var mapController = new MapController.Controller();
        var mapModel = new App.Map.MapModel();
        var map = mapModel.getMap(options.mapConfig);
        //Broadcast event that map model has been initialized
        App.vent.trigger('map:init', map);
    });
});