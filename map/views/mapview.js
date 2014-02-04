$.MapView = Backbone.View.extend({
    initialize: function (map) {
        _.bindAll(this, 'update');

        this.mapModel = map;
        this.template = tpl['map'];

        // this.render();
    },
    render: function () {
        // $(this.options.container).append(this.el);
        // this.$el.html(this.template({ title: this.options.title }, true));
        // return this;
    }
});