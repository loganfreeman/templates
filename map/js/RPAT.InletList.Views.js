RPAT.module('InletList.Views', function(Views, App, Backbone, Marionette, $, _) {

    // RPAT List Item View
    // -------------------
    //
    // Display an individual inlet item, and respond to an
    // item being selected.

    Views.ItemView = Backbone.Marionette.ItemView.extend({
        template: '#template-inletItemView',

        initialize:function () {
            this.model.bind("destroy", this.close, this);
            this.model.bind('change', this.render, this);
        },

        events: {'click': 'itemClicked'},

        onRender: function() {
            this.$el.removeClass('visible hidden highlight');

            if (this.model.get('visible')) {
                this.$el.addClass('visible');
            }
            else {
                this.$el.addClass('hidden');
            }

            if (this.model.get('highlighted')) {
                console.log('highlighting');
                this.highlight();
            }
            else {
                this.$el.removeClass('highlight');
            }
        },

        //This function gets triggered when mouse hovers over an inlet. Higlights and scrolls
        //to the associated inlet. Decided not to implement after playing around w/ overall user experience.
        highlight: function() {
            var container = this.$el.parent(),
                scrollTo = this.$el;
            container.scrollTop(
                scrollTo.offset().top - container.offset().top + container.scrollTop() - 50
            );
            this.$el.addClass('highlight');
        },

        itemClicked: function() {
            App.vent.trigger('inlet:focus',  this.model);
        },

        close:function () {
            $(this.el).unbind();
            $(this.el).remove();
        }
    });

    Views.ListView = Backbone.Marionette.CompositeView.extend({
        template: '#template-inletListView',
        itemView: Views.ItemView,
        itemViewContainer: 'ul'

        // TODO: Implement a no items view when we are loading inlets
        // emptyView: NoItemsView
    });
});
