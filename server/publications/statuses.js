Meteor.publish('status', function (statusId) {
  if(!statusId){
    return [];
  }
  let status =  Statuses.findOne(statusId);
  let query = {_id: statusId};
  if(!status){
    return [];
  }
  if(!this.userId || this.userId != status.userId){
    query.public = true;
  }
  return Statuses.find(query);
});

Meteor.publish('statuses', function (params) {
  let query = (params && params.query)?params.query:{};
  let options = (params && params.options)?params.options:{};
  if(!this.userId || this.userId != userId){
    query = {$and: [query, {$or: [{userId: this.userId},{public: {$eq: true}}]}]};
  }
  return Statuses.find(query, options);
});

Meteor.publish('statuses.byUser', function (userId, params) {
  if(!userId){
    userId = this.userId;
  }
  let query = (params && params.query)?params.query:{};
  let options = (params && params.options)?params.options:{};
  if(!userId){
    return [];
  }
  if(!this.userId || this.userId != userId){
    query.public = true;
  }
  query.userId = userId;
  return Statuses.find(query, options);
});

Meteor.publish('statuses.byUsers', function (params) {
  let query = (params && params.query)?params.query:{};
  let options = (params && params.options)?params.options:{};
  let userIds = Meteor.users.find(query, options).fetch().map(user=>user._id);
  let statusQuery = {$and: [ {userId: {$in: userIds}}, {$or: [{userId: this.userId}, {public: {$eq: true}}]} ]};
  return Statuses.find(query);
});
