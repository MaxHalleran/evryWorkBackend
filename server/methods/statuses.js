Meteor.methods({
  'status.create': status => {
    if(!Meteor.user() ){
      throw new Meteor.Error('access-denied', 'You must be logged in');
    }
    return Statuses.insert(status);
  },
  'status.edit': (statusId, status) => {
    const oldstatus = Statuses.findOne(statusId);
    if(!oldstatus) {
      throw new Meteor.Error('invalid-request', 'Invalid Status');
    }

    if(!Meteor.user()){
      throw new Meteor.Error('access-denied', 'You must be logged in');
    }

    if(oldstatus.userId != Meteor.userId() && !Meteor.user().isAdmin()){
      throw new Meteor.Error('access-denied', 'You do not have permission to do this');
    }

    return Statuses.update(statusId, {$set: status});
  },
  'status.delete': (statusId) => {
    const oldstatus = Statuses.findOne(statusId);
    if(!oldstatus) {
      throw new Meteor.Error('invalid-request', 'Invalid Status');
    }

    if(!Meteor.user()){
      throw new Meteor.Error('access-denied', 'You must be logged in');
    }

    if(oldstatus.userId != Meteor.userId() && !Meteor.user().isAdmin()){
      throw new Meteor.Error('access-denied', 'You do not have permission to do this');
    }

    return Statuses.remove(statusId);
  },
});
