
  var AddressBook = new Marionette.Application();

  AddressBook.addRegions({
    mainRegion: "#main-region",
    headerRegion: "#header-region"
  });


  AddressBook.navigate = function(route, options){
    var options = options || {};
    Backbone.history.navigate(route, options);
    console.log('Navigating hero');
  }

  AddressBook.getCurrentRoute = function(){
    // console.log('Getting Route');
    return Backbone.history.fragment;
  }

  AddressBook.on("initialize:after", function(){
    AddressBook.mainRegion.show(contactsView);

    if (Backbone.history){
      Backbone.history.start();

      if (this.getCurrentRoute() === ""){
        // console.log('Using this getCurrentRoute')
        this.navigate('listContacts');
      }
    }

  });


