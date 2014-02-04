RPAT.module('Map', function(Map, App, Backbone, Marionette, $, _) {

    // Map Model
    // -----------

    Map.MapModel = Backbone.Model.extend({

        initialize: function() {
            // App.vent.on('inlet:focus', this.zoomToPoint(this.geometry), this);
            App.vent.on('inlet:focus', function(model){
                this.zoomToPoint(model.get('geometry'));
            }, this);
        },

        getMap: function(mapConfig) {
            this.map = new esri.Map('map-container', {
                center: mapConfig.mapCenter,
                zoom: mapConfig.zoom,
                sliderStyle: 'small'
             });
            this.initBaseLayers(mapConfig.basemaps);
            dojo.connect(this.map, "onExtentChange", function(){
                App.vent.trigger('map:extentChange', this.extent);
            });
            return this.map;
        },

        initBaseLayers: function(basemaps) {
            _.each(basemaps, function(layer){
                switch(layer.type){
                    case 'ArcGISTiledMapServiceLayer':
                        var lyr = new esri.layers.ArcGISTiledMapServiceLayer(layer.url,
                            {
                                id: 'basemap_' + layer.name,
                                visible: layer.visible
                            });
                        this.map.addLayer(lyr);
                        break;
                    default:
                        alert(layer.type + ' layers not currently supported for basemaps');
                        break;
                }
            }, this);
        },

        zoomToPoint: function(geom) {
            this.map.centerAndZoom(geom, 13);
        }
    });
});