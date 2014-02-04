
// Static Collection
var collection = new AddressBook.ContactCollection([
  {
    firstName: "Bob",
    lastName: "Brigham",
    phoneNumber: "555-0163",
    age: 21
  },
  {
    firstName: "Alice",
    lastName: "Arten",
    phoneNumber: "555-0184",
    age: 30
  },
  {
    firstName: "Charlie",
    lastName: "Campbell",
    phoneNumber: "555-0129",
    age: 2
  }
]);

var contactsView = new AddressBook.ContactsView({
  collection: collection
});


contactsView.on("itemview:contact:delete", function(view, model){
  console.log("yser");
  console.log('view' + view)
  console.log('model' + model)
});
