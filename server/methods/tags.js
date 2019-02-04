Meteor.methods({
  'tag.create': tag => {
    if(!Meteor.user() || !Meteor.user().isAdmin()){
      throw new Meteor.Error('access-denied', 'You do not have permission to do this');
    }
    return Tags.insert(tag);
  },
  'tag.edit': (tagId, tag) => {
    if(!Meteor.user() || !Meteor.user().isAdmin()){
      throw new Meteor.Error('access-denied', 'You do not have permission to do this');
    }
    return Tags.update(tagId, {$set: tag});
  },
  'tag.delete': tagId => {
    if(!Meteor.user() || !Meteor.user().isAdmin()){
      throw new Meteor.Error('access-denied', 'You do not have permission to do this');
    }
    return Tags.remove(tagId);
  },
});
