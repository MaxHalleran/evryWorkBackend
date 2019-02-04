Meteor.publish('routine', function (routineId) {
  return Routines.find(routineId);
});

Meteor.publish('routines', function (params) {
  let query = (params && params.query)?params.query:{};
  let options = (params && params.options)?params.options:{};
  return Routines.find(query, options);
});
