import { Template } from 'meteor/templating';
 
import { Tasks } from '../api/tasks.js';
 
import './task.html';
 
Template.task.events({
  'click .toggle-checked'() {
    // Set the checked property to the opposite of its current value
    Meteor.call('tasks.setChecked', this._id, !this.checked, function(error) {
    	if(error)
	    	Materialize.toast('Error: '+error.error, 4000);
	    else
	        Materialize.toast('Task state updated.', 4000);
    });
  },
  'click .delete'() {
    Meteor.call('tasks.remove', this._id, function(error) {
    	if(error)
	    	Materialize.toast('Error: '+error.error, 4000);
	    else
	        Materialize.toast('Task deleted.', 4000);
    });
  }
});