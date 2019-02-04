Meteor.publish('categories', function (params) {
  let query = (params && params.query)?params.query:{};
  let options = (params && params.options)?params.options:{};
  return Categories.find(query, options);
});

Meteor.publish('category', function (categoryId) {
  return Categories.find({_id: categoryId});
});
