AddressBook.Contact = Backbone.Model.extend({});

AddressBook.ContactCollection = Backbone.Collection.extend({
  model: AddressBook.Contact,
  comparator: "firstName"
});
