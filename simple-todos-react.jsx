// Define a collection to hold our tasks
TaskDB = new Mongo.Collection("taskMap");

if (Meteor.isClient) {
  // This code is executed on the client only
  Accounts.ui.config({
     passwordSignupFields: "USERNAME_ONLY"
   });

   Meteor.subscribe("taskMap");
  Meteor.startup(function () {
    // Use Meteor.startup to render the component after the page is ready
    React.render(<App />, document.getElementById("render-target"));
  });
}

if (Meteor.isServer) {
//  Meteor.publish("taskMap", function () {
//    return TaskDB.find();

Meteor.publish("taskMap", function () {
  return TaskDB.find({
    $or: [
      { private: {$ne: true} },
      { owner: this.userId }
    ]
  });

  });
}


Meteor.methods({
  addTask(text) {
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    TaskDB.insert({
      text: text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username
    });
  },

  removeTask(taskId) {

    const task = TaskDB.findOne(taskId);
   if (task.private && task.owner !== Meteor.userId()) {
     // If the task is private, make sure only the owner can delete it
     throw new Meteor.Error("not-authorized");
   }

    TaskDB.remove(taskId);
  },

  setChecked(taskId, setChecked) {

    const task = TaskDB.findOne(taskId);
  if (task.private && task.owner !== Meteor.userId()) {
    // If the task is private, make sure only the owner can check it off
    throw new Meteor.Error("not-authorized");
  }

    TaskDB.update(taskId, { $set: { checked: setChecked} });
  },

  setPrivate(taskId, setToPrivate) {
  const task = TaskDB.findOne(taskId);

  // Make sure only the task owner can make a task private
  if (task.owner !== Meteor.userId()) {
    throw new Meteor.Error("not-authorized");
  }

  TaskDB.update(taskId, { $set: { private: setToPrivate } });
}

});
