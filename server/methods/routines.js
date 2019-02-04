Meteor.methods({
  'routine.create': routine => {
    if(!Meteor.user() ){
      throw new Meteor.Error('access-denied', 'You must be logged in');
    }
    return Routines.insert(routine);
  },
  'routine.edit': (routineId, routine) => {
    const oldRoutine = Routines.findOne(routineId);
    if(!oldRoutine) {
      throw new Meteor.Error('invalid-request', 'Invalid Routine');
    }

    if(!Meteor.user()){
      throw new Meteor.Error('access-denied', 'You must be logged in');
    }

    if(oldRoutine.author != Meteor.userId() && !Meteor.user().isAdmin()){
      throw new Meteor.Error('access-denied', 'You do not have permission to do this');
    }

    return Routines.update(routineId, {$set: routine});
  },
  'routine.delete': (routineId) => {
    const oldRoutine = Routines.findOne(routineId);
    if(!oldRoutine) {
      throw new Meteor.Error('invalid-request', 'Invalid Routine');
    }

    if(!Meteor.user()){
      throw new Meteor.Error('access-denied', 'You must be logged in');
    }

    if(oldRoutine.author != Meteor.userId() && !Meteor.user().isAdmin()){
      throw new Meteor.Error('access-denied', 'You do not have permission to do this');
    }

    return Routines.remove(routineId);
  },
});
