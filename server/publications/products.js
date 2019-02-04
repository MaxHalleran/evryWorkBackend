Meteor.publish('products', function (params) {
  let query = (params && params.query)?params.query:{};
  let options = (params && params.options)?params.options:{};
  const user = Meteor.users.findOne(this.userId);
  if(!user || !user.isAdmin()){
    query.status == 'published';
  }
  return Products.find(query, options);
});


Meteor.publish('product', function (productId) {
  return Products.find({_id: productId});
});
