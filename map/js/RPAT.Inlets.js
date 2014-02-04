RPAT.module('Inlets', function(Inlets, App, Backbone, Marionette, $, _) {

    // Inlet Model
    // -----------

    Inlets.Inlet = Backbone.Model.extend({

        idAttribute: "OBJECTID",

        defaults: {
            selected: false,
            visible: true,
            highlighted: false
        }
    });

    Inlets.InletList = Backbone.Collection.extend({
        model: Inlets.Inlet,

        initialize: function(map, options) {
            this.esriMap = map;
            this.options = options;
            this.fetch();
            //Listen for the map changing extent and filter list accordingly
            App.vent.on('map:extentChange', function(extent){
                this.filter(extent);
            }, this);
        },

        fetch: function() {
            var url = "http://155.82.160.6/arcgis/rest/services/Oceans/CIRP_Inlets_Viewer/MapServer/0";
            var content = "<b>${INLET_NAME}</b><br />" +
                "<a href='#inlets/${OBJECTID}'>Let's get more info...</a>";
            var infoTemplate = new esri.InfoTemplate("Inlets", content);
            this.inletLayer = new esri.layers.FeatureLayer(this.options.mapServiceUrl, {
                mode: esri.layers.FeatureLayer.MODE_SNAPSHOT,
                outFields: ["OBJECTID", "INLET_NAME"],
                infoTemplate: infoTemplate
            });
            var that = this;
            dojo.connect(this.inletLayer, "onUpdateEnd", function(error){
                if (error) {
                    // TODO: Provide a cleaner UI affect for layer failure
                    alert('Error loading map. Please try again later');
                }
                //create two parallel arrays that contain attributes and a geometry
                var graphicItems = _.pluck(this.graphics, 'attributes');
                var geoms = _.pluck(this.graphics, 'geometry');
                //merge geometry into attributes
                items = _.map(graphicItems, function(item, i){
                    item.geometry = geoms[i];
                    return item;
                });
                that.reset(items);
            });
            defaultSymbol = new esri.symbol.SimpleMarkerSymbol().setColor(new dojo.Color(this.options.defaultSymbol));
            defaultSymbol.setSize(8);
            this.inletLayer.setRenderer(new esri.renderer.SimpleRenderer(defaultSymbol));
            this.esriMap.addLayer(this.inletLayer);
            //Currently not using this var, but it may be useful down the line
            this.currentInletId = null;

            dojo.connect(this.inletLayer, "onClick", function(evt){
                //Send event that includes the current highlighted item along with the new item to highlight
                var args = {
                    id: evt.graphic.attributes.OBJECTID,
                    formerId: this.currentInletId,
                    geom: evt.graphic.attributes.geometry
                };
                App.vent.trigger("inlet:onClick", args);
                //Once event has been triggered, reset the currentInlet variable
                this.currentInletId = evt.graphic.attributes.OBJECTID;
            });
        },

        filter: function(extent) {
            //Set all models visibility attribute to false
            //If geom falls within extent, set visibility = true
            _.each(this.models, function(inlet){
                inlet.set({'visible': false});
                if (extent.contains(inlet.get('geometry'))){
                    inlet.set({'visible': true});
                }
            }, this);
        },

        toggleHighlight: function(id) {
            item = this.get(id);
            toggle = !item.get('highlighted');
            item.set({'highlighted': toggle});
        },

        highlightPoint: function(id) {
            //TODO: Highlight point when hovering over list item
        },

        // Sorts our collection
        comparator: function(cat) {
            return cat.get(this.options.orderBy);
        }    });
});