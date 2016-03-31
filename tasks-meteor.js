Tasks = new Mongo.Collection('tasks');

if (Meteor.isClient) {
  Template.body.helpers({
    tasks:function(){
      if (Session.get('hideFinished')) {
        return Tasks.find( { checked: { $ne: true } } );
      }
      else{
      return Tasks.find();
      }
    },
    hideFinished:function(){
      return Session.get('hideFinished');
    }
  });

  Template.task.events({
    "click .toggle-checked":function(){
      Tasks.update(this._id, {$set:{checked: !this.checked}});
    },
    "click .delete":function(){
      Tasks.remove(this._id);
    },
  })

  Template.body.events({
    'submit .new-task': function(event){
      var title = event.target.title.value;
      if (title.length > 0) {
        Tasks.insert({
          title:title,
           createdAt: new Date()
         });
      }
      else{
        alert("Ingresa texto!");
      }
        event.target.title.value = '';
        return false
    },
    'change .hide-finished':function(event){
      Session.set('hideFinished', event.target.checked);
    }
  });

  Accounts.ui.config({
    passwordSignupFields : "USERNAME_ONLY"
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
