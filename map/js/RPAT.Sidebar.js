RPAT.module('Sidebar', function(Sidebar, App, Backbone, Marionette, $, _) {

    // Sidebar Router
    // -----------------
    //
    // Handle routes to show the selected inlet

    Sidebar.Router = Marionette.AppRouter.extend({
        appRoutes: {
            '': 'home',
            'inlets/:_id': 'inletDetails'
        }
    });

    // Sidebar Controller (Mediator)
    // ------------------------------
    //
    // Control the workflow and logic that exists at the application
    // level, above the implementation detail of views and models

    Sidebar.Controller = function(map, options) {
        this.layout = new App.Layout.Sidebar();
        App.sidebar.show(this.layout);
        this.inletList = new App.Inlets.InletList(map, options);
    };

    _.extend(Sidebar.Controller.prototype, {

        home: function() {
            this.inletList.on('reset', this.showInlets, this);
        },

        inletDetails: function(_id) {
            this.layout.inletSearch.close();
            this.layout.inletInfo.show(new App.Inlet.Views.InletInfoView({
                model: this.inletList.get(_id)
            }));
        },

        showInlets: function() {
            this.layout.inletSearch.show(new App.InletList.Views.ListView({
                collection: this.inletList
            }));
        }
    });

    Sidebar.addInitializer(function(options) {
        //Once map has been initialized, launch an InletList controller
        App.vent.on('map:init', function(map){
            var sideBarController = new Sidebar.Controller(map, options.inletConfig);
            new Sidebar.Router({
                controller: sideBarController
            }, this);
            App.vent.on('inlet:onClick', function(args){
                this.inletList.toggleHighlight(args.id);
                if (args.formerId) { this.inletList.toggleHighlight(args.formerId); }
            }, sideBarController);
        });
    });
});