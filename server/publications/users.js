Meteor.publish('user.email', function (userId) {
  userId = userId?userId:this.userId;
  if(!userId){
    return [];
  }
  return Meteor.users.find(userId, {fields: {emails:1}});
});

Meteor.publish('user.publicProfile', function (userId) {
  userId = userId?userId:this.userId;
  if(!userId){
    return [];
  }
  return Meteor.users.find(userId, {fields: {profile:1}});
});

Meteor.publish('user', function (userId) {
  userId = userId?userId:this.userId;
  if(!userId){
    return [];
  }
  const thisUser = Meteor.users.findOne(this.userId);
    if (typeof thisUser !== 'undefined') {
        if (userId != this.userId && !thisUser.isAdmin()) {
            return [];
        }
    }
  return Meteor.users.find(userId);
});

Meteor.publish('users', function (params) {
  let query = (params && params.query)?params.query:{};
  let options = (params && params.options)?params.options:{};
  return Meteor.users.find(query, options);
});
