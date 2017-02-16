import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Tasks } from '../api/tasks.js';
 
import './task.js'
import './body.html';

Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe('tasks');
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
});

Template.body.events({
  'submit .new-task'(event) {
    // Prevent default browser form submit
    event.preventDefault();
    console.log("new task submitted!");
    // Get value from form element
    const target = event.target;
    const todo = target.todo.value;
    const outcome = target.outcome.value;
    const desire = target.desire.value;

 
    // Insert a task into the collection
    const newTask = {
      todo: todo,
      outcome: outcome,
      desire: desire,
      owner: Meteor.userId(),
      createdAt: new Date(), // current time
    };

    Meteor.call('tasks.insert', newTask);
 
    // Clear form
    target.todo.value = '';
    target.outcome.value = '';
    target.desire.value = '';
  },
  'change .hide-completed input'(event, instance) {
    instance.state.set('hideCompleted', event.target.checked);
  },
});