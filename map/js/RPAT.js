var RPAT = new Backbone.Marionette.Application();

RPAT.addRegions({
    map: '#map-container',
    sidebar: '#sidebar-container'
});

RPAT.on('initialize:after', function() {
    Backbone.history.start();
});