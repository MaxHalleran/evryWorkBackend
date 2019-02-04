import './methods';
import './publications';
import '/lib/collections';
import './importData.js';

Accounts.urls.resetPassword = function(token) {
  return Meteor.absoluteUrl('resetPassword/' + token);
}
