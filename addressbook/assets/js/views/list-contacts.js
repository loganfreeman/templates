

// Address Book ItemView
AddressBook.ContactView = Marionette.ItemView.extend({
  tagName: "tr",
  template: "#contact-list-item",

  events: {
    "click .js-delete": "deleteItem",
    "click .js-show": "showClicked"
  },

  // Added fadeOut effect when Item View is being removed
  remove: function(){
    var self = this;
    this.$el.fadeOut(function(){
      Marionette.ItemView.prototype.remove.call(self);
    })
  },

  deleteItem: function(e) {
    e.stopPropagation();
    this.trigger('contact:delete');
  },

  showClicked: function(e) {
    e.stopPropagation();
    this.trigger("contact:show", this.model);
  }

});

AddressBook.Show = Marionette.ItemView.extend({
  template: "#contact-show"
});

// Address Book Composite View
AddressBook.ContactsView = Marionette.CompositeView.extend({
  tagName: "table",
  className: "table table-hover table-striped table-bordered",
  template: "#contacts-list",
  itemView: AddressBook.ContactView,
  itemViewContainer: "tbody",

  initialize: function(){
    this.on("itemview:contact:delete", function(view){
      this.collection.remove(view.model);
    });

    this.on("itemview:contact:show", function(view){
      console.log("Received itemview:contact:show event on model ", view);
      var viewer = new AddressBook.Show({ model: view.model });
      AddressBook.mainRegion.show(viewer);

      var v = view.model;

      console.log (v.toJSON()); 

    });
  }

  // Function helper when itemview:contact:delete is being called
  // onItemviewContactDelete: function(){
  // ....
  // }

});

