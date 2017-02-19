import { Template } from 'meteor/templating';

import { Tasks } from '../api/tasks.js';
 
import './task.js'
import './body.html';

Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe('tasks');
});

Template.body.onRendered(function bodyOnRendered() {
  $(".button-collapse").sideNav();
});
 
Template.body.helpers({
  tasks() {
    const instance = Template.instance();
    if (instance.state.get('hideCompleted')) {
      // If hide completed is checked, filter tasks
      return Tasks.find({ checked: { $ne: true } }, { sort: { createdAt: -1 } });
    }
    // Otherwise, return all of the tasks
    return Tasks.find({}, { sort: { createdAt: -1 } });
  },
  incompleteCount() {
    return Tasks.find({ checked: { $ne: true } }).count();
  },
  hideCompleted() {
    const instance = Template.instance();
    return instance.state.get('hideCompleted');
  }
});

Template.body.events({
  'submit #new-task-form'(event) {
    // Prevent default browser form submit
    event.preventDefault();
    // Get value from form element
    const target = event.target;
    const todo = target.todo.value;
    const outcome = target.outcome.value;
    const desire = target.desire.value;

    const newTask = {
      todo: todo,
      outcome: outcome,
      desire: desire
    };

    // Insert a task into the collection
    Meteor.call('tasks.insert', newTask, function(error) {
      if(error)
        Materialize.toast('Error: '+error.error, 4000);
      else
        Materialize.toast('Task successfully inserted', 4000);
    });
 
    // Clear form
    target.todo.value = '';
    target.outcome.value = '';
    target.desire.value = '';
  },
  'click .hide-completed'(event) {
    const instance = Template.instance();
    instance.state.set('hideCompleted', !instance.state.get('hideCompleted'));
  },
  'click .new-task'(event){
    const instance = Template.instance();
    instance.$('#new-task-div').show();
    instance.$('.button-collapse').sideNav('hide');
  }
});