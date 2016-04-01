Tasks = new Mongo.Collection('tasks');

if (Meteor.isClient) {

  Meteor.subscribe("tasks")

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
      Meteor.call("updateTask", this._id, !this.checked);
    },
    "click .delete":function(){
      Meteor.call("deleteTask", this._id);
    },
  })

  Template.body.events({
    'submit .new-task': function(event){
      var title = event.target.title.value;
      if (title.length > 0) {
        Meteor.call("addTask", title);

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

  Meteor.publish("tasks", function(){
    return Tasks.find();
  })
}
//Secure meteor methods.
Meteor.methods({
  addTask: function(title){
    Tasks.insert({
      title:title,
      createdAt: new Date()
      });
  },
  deleteTask: function(id){
    Tasks.remove(id);

  },
  updateTask: function(id, checked){
    Tasks.update(id, {
      $set:{
        checked: checked
      }
    });
  }
});
