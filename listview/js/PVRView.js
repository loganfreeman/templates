
PVR.module("PVRView", function(PVRView, App, Backbone, Marionette, $, _){
    PVRView.SingleItemView = Marionette.ItemView.extend({
        id: "rec_row",
        className: "clickable_row",
        compiledTemplate: _.template($('#template-list-item-view').html()),

        initialize: function(options) {
            this.id += options.index;
            this.$el.prop("id", this.id);
        },

        render: function () {
//            this.id = this.idPrefix + "";
//            console.log(this.model.attributes.additionalInfo.title);
            if (this.model.attributes.additionalInfo !== undefined) {
                this.$el.html(this.compiledTemplate({
                    title: this.model.attributes.additionalInfo.title || '',
                    schedule: this.model.attributes.additionalInfo.schedule || '',
                    info: this.model.attributes.additionalInfo.info || ''
                }));
            }
            return this;
        }
    });

    // Define a collection view to show
    // ---------------------
    PVRView.ListView = Marionette.CollectionView.extend({
        id: "list1",
        itemView: PVRView.SingleItemView,
        _collection: new Backbone.Collection(),
        currentSelectedRow: null,
        noteBox: "#notebox",

        events: {
            'click .clickable_row': 'viewClicked',
            'scroll': 'viewScrolled'
        },

        viewClicked: function(event) {
            console.log("ListView viewClicked");
            var currentElement = event.currentTarget;

            if (this.currentSelectedRow != null) {
                $(this.currentSelectedRow).css("background-color","#c5f2fb");

                var copy = this.currentSelectedRow;
                $(this.currentSelectedRow).hover(function(){
                    $(copy).css("background-color","#d1d1d1");
                },function(){
                    $(copy).css("background-color","#c5f2fb");
                });
            }
            $(currentElement).css("background-color","rgb(255, 128, 21)");
            this.currentSelectedRow = currentElement;
        },

        viewScrolled: function(event) {
            if($(event.currentTarget).scrollTop() + $(event.currentTarget).outerHeight() == $(event.currentTarget)[0].scrollHeight) {
                $(this.noteBox).fadeIn(1000);

                var setTimeoutCallBack = (function(t){
                    return function() {
                        //fetch data
                        t.loadPage(function(view){
                            t.show(view);

                            // hide notification box
                            $(t.noteBox).fadeOut(1000);
                        });
                    }
                })(this);
                setTimeout(setTimeoutCallBack, 1000);
            }
        },

        index: 0,
        buildItemView: function(item, ItemViewType, itemViewOptions){
            // build the final list of options for the item view type
            var options = _.extend({model: item}, itemViewOptions);
            // create the item view instance
            var view = new ItemViewType({
                model: item,
                index: ++this.index
            });
            // return it
            return view;
        },

        // each page is 15 records
        page: 1,
        loadPage: function(callback) {
            var fetchRecordingsCallBack = (function (t) {
                return function (collection) {
                    t._collection.add(collection.models);
                    var view = new App.PVRView.ListView({
                        collection: t._collection
                    });

                    $(t.noteBox).fadeOut(1000);
                    t.page++; // increment page
                    // call back with result view
                    callback(view);
                }
            })(this);

            var recordings = new App.PVRModel.RecordingCollection();
            recordings.fetchRecordings(fetchRecordingsCallBack, this.page);
        }
    });
});