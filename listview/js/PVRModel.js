
PVR.module("PVRModel", function(PVRModel, App, Backbone, Marionette, $, _){
    PVRModel.RecordingCollection = Backbone.Collection.extend({
        url: "recordings_additionalinfo.json",

        fetchRecordings: function (callback, page) {
            this.fetch({
                success: function(collection, response) {
                    collection.reset();
//                    console.log("collection size " + collection.size());
                    collection.add(response.recordingAssets.slice((page-1)*12, page*12));
                    callback(collection);
                }
            });
        }
    });
});