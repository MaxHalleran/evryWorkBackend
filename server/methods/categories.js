Meteor.methods({
  'category.create': category => {
    if(!Meteor.user() || !Meteor.user().isAdmin()){
      throw new Meteor.Error('access-denied', 'You do not have permission to do this');
    }
    return Categories.insert(category);
  },
  'category.edit': (categoryId, category) => {
    if(!Meteor.user() || !Meteor.user().isAdmin()){
      throw new Meteor.Error('access-denied', 'You do not have permission to do this');
    }
    return Categories.update(categoryId, {$set: category});
  },
  'category.delete': (categoryId) => {
    if(!Meteor.user() || !Meteor.user().isAdmin()){
      throw new Meteor.Error('access-denied', 'You do not have permission to do this');
    }
    return Categories.remove(categoryId);
  },
});
