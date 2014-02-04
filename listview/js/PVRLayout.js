
PVR.module("PVRLayout", function(PVRLayout, App, Backbone, Marionette, $, _){
    // Define a controller to run this module
    // --------------------------------------
    PVRLayout.ListViewContainer = Marionette.Layout.extend({
        template: '#template-list-view',
        listView: new App.PVRView.ListView(),
        currentSelectedRow: null,

        regions: {
            listbox: "#listbox"
        },

        events: {
            'click .clickable_row': 'rowClicked'
        },

        rowClicked: function(event) {
            console.log("rowClicked");
            $("#rightpane-div1").html($(event.currentTarget).children("#rec_title")[0].innerHTML);
            $("#rightpane-div2").html($(event.currentTarget).children("#rec_date")[0].innerHTML);
            $("#rightpane-div3").html($(event.currentTarget).children("#rec_type")[0].innerHTML);
        },

        onRender: function () {
            var loadPageCallBack = (function(t) {
                return function(view) {
                    t.listbox.show(view);
                }
            })(this);
            this.listView.loadPage(loadPageCallBack);
        }
    });
});