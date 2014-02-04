
PVR.module("PVRController", function(PVRController, App, Backbone, Marionette, $, _){
    // Define a controller to run this module
    // --------------------------------------
    PVRController.Controller = Marionette.Controller.extend({
        start: function(){
            var listViewContainer = new App.PVRLayout.ListViewContainer();
            App.content.show(listViewContainer);
        }
    });

    // Initialize this module when the app starts
    // ------------------------------------------
    PVRController.addInitializer(function(){
        var controller = new PVRController.Controller();
        controller.start();
    });
});