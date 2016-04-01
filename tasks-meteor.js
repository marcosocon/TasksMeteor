Tasks = new Mongo.Collection('tasks');

if (Meteor.isClient) {

  Meteor.subscribe("tasks");
//BODY JS - helpers.
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
//BODY JS - events.
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
//TASK JS - helpers.
  Template.task.helpers({
    isOwner: function(){
      if (this.owner === Meteor.userId()){
        return true
      }
      else{
        return false
      }
    }
  });

  Template.task.events({
    "click .toggle-private":function(){
      Meteor.call("setPrivate", this._id, !this.private);
    }
  });

//Task JS - events
  Template.task.events({
    "click .toggle-checked":function(){
      Meteor.call("updateTask", this._id, !this.checked);
    },
    "click .delete":function(){
      Meteor.call("deleteTask", this._id);
    },
  });


//ACCOUNTS-UI - config.
  Accounts.ui.config({
    passwordSignupFields : "USERNAME_ONLY"
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });

  Meteor.publish("tasks", function(){
    return Tasks.find({
      $or: [
      {private: { $ne:true }},
      {owner: this.userId}
      ]
    });
  });
}
//Secure meteor methods.
Meteor.methods({
  addTask: function(title){
    Tasks.insert({
      title:title,
      createdAt: new Date(),
      owner: Meteor.userId()
      });
  },
  deleteTask: function(id){
    Tasks.remove(id);

  },
  setPrivate:function(id, private){
    var task = Tasks.findOne(id);
    if (task.owner !== Meteor.userId()) {
      throw new Meteor.Error("Access denied!");
    }
    Tasks.update(id, {
      $set:{
        private: private
      }
    });

  },
  updateTask: function(id, checked){
    Tasks.update(id, {
      $set:{
        checked: checked
      }
    });
  }
});
