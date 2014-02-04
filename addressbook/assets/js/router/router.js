// Router for Address Book
AddressBook.Router = Marionette.AppRouter.extend({
  appRoutes: {
    "listContacts": "listContacts",
    "aaron": "displayAaron",
    "aaron/:id": "displayID"
  }
});

var API = {
  listContacts: function(){
    console.log('listContacts Page')
  },
  displayAaron: function(){
    console.log("Aaron Site");
  },
  displayID: function(id){
    console.log('ID is: ' + id);
  }
}

AddressBook.addInitializer(function(){
  new AddressBook.Router({
    controller: API
  });
});