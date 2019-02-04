Meteor.publish('tag', function (tagId) {
  return Tags.find(tagId);
});

Meteor.publish('tags', function (params) {
  let query = (params && params.query)?params.query:{};
  let options = (params && params.options)?params.options:{};
  return Tags.find(query, options);
});
