var PVR = new Marionette.Application();

PVR.addRegions({
    header: '#header',
    content: '#content',
    footer: '#footer'
});

PVR.on('initialize:after', function () {
    Backbone.history.start();
});