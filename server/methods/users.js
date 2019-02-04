Meteor.methods({
  'user.create': user => {
    if(!user.email){
      throw new Meteor.Error('invalid-request', "Please enter a valid email");
    }

    const existingEmail = Meteor.users.find({$or: [{'emails': {$elemMatch: {address: user.email}}}, {'services.facebook.email': user.email}, {'services.google.email': user.email}, {'services.linkedin.email': user.email}]}).count()

    if(existingEmail >= 1){
      throw new Meteor.Error('invalid-request', 'That email is already in use');
    }

    /*if(!user.profile.firstName || !user.profile.firstName.trim().length >= 2){
      throw new Meteor.Error('invalid-request', "Please enter your first name");
    }

    if(!user.profile.lastName || !user.profile.lastName.trim().length >= 2){
      throw new Meteor.Error('invalid-request', "Please enter your last name");
    }*/

    if(!user.password || !user.password.trim().length >= 4){
      throw new Meteor.Error('invalid-request', "Please enter a password at least 4 characters long");
    }

    const userId = Accounts.createUser({email: user.email, password: user.password});
    if(userId){
      if(user.profile){
        Meteor.users.update(userId, {$set: {
          profile: user.profile,
        }});
      }
      return userId;
    }else{
      throw new Meteor.Error('account-error', "Unable to create your account");
    }
  },
  'user.delete'(userId){
    if(!Meteor.user() || !Meteor.user().isAdmin() || Meteor.userId() == userId){
      throw new Meteor.Error('access-denied', 'You do not have permission to do this');
    }
    const user = Meteor.users.findOne(userId);
    if(!user){
      throw new Meteor.Error('invalid-request', 'Invalid user');
    }

    return Meteor.users.remove(userId);
  },
  'user.update'(userInfo, userId){
    if(!Meteor.userId()){
      throw new Meteor.Error('permission-denied', 'You need to be logged in');
    }
    if(!userId){
      userId = Meteor.userId();
    }

    if(Meteor.userId() != userId && !Meteor.user().isAdmin()){
      throw new Meteor.Error('permission-denied', 'You do not have permission to do this');
    }

    const email = userInfo.email;

    const existingEmail = Meteor.users.findOne({$or: [{'emails': {$elemMatch: {address: email}}}, {'services.facebook.email': email}, {'services.google.email': email}, {'services.linkedin.email': email}]});
    console.log(existingEmail, userId);
    if(existingEmail && existingEmail._id != userId){
      throw new Meteor.Error('invalid-request', 'That email is already in use');
    }

    const user = Meteor.users.findOne(userId);
    if(user.emails && user.emails[0]){
      Accounts.removeEmail(userId, user.emails[0].address);
    }
    Accounts.addEmail(userId, email);
    Accounts.sendVerificationEmail(userId);
    if(userInfo.profile){
      Meteor.users.update(userId, {profile: userInfo.profile});
    }
  },
  'user.changeEmail'(email, userId){
    if(!Meteor.userId()){
      throw new Meteor.Error('permission-denied', 'You need to be logged in');
    }
    if(!userId){
      userId = Meteor.userId();
    }

    if(Meteor.userId() != userId && !Meteor.user().isAdmin()){
      throw new Meteor.Error('permission-denied', 'You do not have permission to do this');
    }

    const existingEmail = Meteor.users.find({$or: [{'emails': {$elemMatch: {address: email}}}, {'services.facebook.email': email}, {'services.google.email': email}, {'services.linkedin.email': email}]}).fetch()

    if(existingEmail && existingEmail._id != userId){
      throw new Meteor.Error('invalid-request', 'That email is already in use');
    }

    const user = Meteor.users.findOne(userId);
    if(user.emails && user.emails[0]){
      Accounts.removeEmail(userId, user.emails[0].address);
    }
    Accounts.addEmail(userId, email);
    return Accounts.sendVerificationEmail(userId);
  },
  'user.changePassword'(password, userId){
    if(!Meteor.userId()){
      throw new Meteor.Error('permission-denied', 'You need to be logged in');
    }
    if(!userId){
      userId = Meteor.userId();
    }

    if(Meteor.userId() != userId && !Meteor.user().isAdmin()){
      throw new Meteor.Error('permission-denied', 'You do not have permission to do this');
    }
    const user = Meteor.users.findOne(userId);
    if(!userId){
      throw new Meteor.Error('invalid-request', 'Invalid user');
    }

    return Accounts.setPassword(userId, password, {logout: false});
  },
  'user.clearDevices'(userId){
    if(!Meteor.userId()){
      throw new Meteor.Error('permission-denied', 'You need to be logged in');
    }
    if(!userId){
      userId = Meteor.userId();
    }

    if(Meteor.userId() != userId && !Meteor.user().isAdmin()){
      throw new Meteor.Error('permission-denied', 'You do not have permission to do this');
    }

    return Meteor.users.update(userId, {$set: {recognizedDevices: []}});
  },
  'user.updateProfile'(profile, userId){
    if(!Meteor.userId()){
      throw new Meteor.Error('permission-denied', 'You need to be logged in');
    }
    if(!userId){
      userId = Meteor.userId();
    }

    const oldUser = Meteor.users.findOne(userId);

    if(Meteor.userId() != userId && !Meteor.user().isAdmin()){
      throw new Meteor.Error('permission-denied', 'You do not have permission to do this');
    }

    if(profile.email && oldUser.getEmail() != profile.email){
      const existingEmail = Meteor.users.find({$or: [{'emails': {$elemMatch: {address: profile.email}}}, {'services.facebook.email': profile.email}, {'services.google.email': profile.email}, {'services.linkedin.email': profile.email}]}).fetch()

      if(existingEmail && existingEmail._id != userId){
        throw new Meteor.Error('invalid-request', 'That email is already in use');
      }

      if(oldUser.emails && oldUser.emails[0]){
        Accounts.removeEmail(userId, oldUser.emails[0].address);
      }
      Accounts.addEmail(userId, email);
      Accounts.sendVerificationEmail(userId);
      delete profile.email;
    }

    return Meteor.users.update(userId, {$set: {profile: profile}});
  },
  'user.followRoutine'(routineId, userId){
    if(!Meteor.userId()){
      throw new Meteor.Error('permission-denied', 'You need to be logged in');
    }
    if(!userId){
      userId = Meteor.userId();
    }

    if(Meteor.userId() != userId && !Meteor.user().isAdmin()){
      throw new Meteor.Error('permission-denied', 'You do not have permission to do this');
    }

    let user = Meteor.users.findOne(userId);

    if(!user){
      throw new Meteor.Error('invalid-request', 'Invalid user ID');
    }

    if(!Routines.findOne(routineId)){
      throw new Meteor.Error('invalid-request', 'Invalid routine ID');
    }

    if(user.hasRoutine(routineId)){
      throw new Meteor.Error('invalid-request', 'Already following routine');
    }

    let routines = user.routines;
    if(!routines){
      routines = [];
    }

    routines.push({_id: routineId});

    return Meteor.users.update(userId, {$set: {routines}});
  },
  'user.unfollowRoutine'(routineId, userId){
    if(!Meteor.userId()){
      throw new Meteor.Error('permission-denied', 'You need to be logged in');
    }
    if(!userId){
      userId = Meteor.userId();
    }

    if(Meteor.userId() != userId && !Meteor.user().isAdmin()){
      throw new Meteor.Error('permission-denied', 'You do not have permission to do this');
    }

    let user = Meteor.users.findOne(userId);

    if(!user){
      throw new Meteor.Error('invalid-request', 'Invalid user ID');
    }

    if(!Routines.findOne(routineId)){
      throw new Meteor.Error('invalid-request', 'Invalid routine ID');
    }

    if(!user.hasRoutine(routineId)){
      return true;
    }

    let oldRoutines = user.routines,
        routines = [];
    if(!oldRoutines){
      oldRoutines = [];
    }

    for(let r = 0; r<oldRoutines.length; r++){
      console.log(oldRoutines[r]._id, routineId);
      if(oldRoutines[r]._id != routineId){
        routines.push(oldRoutines[r]);
      }
    }

    console.log(routines);

    return Meteor.users.update(userId, {$set: {routines}});
  },
});
