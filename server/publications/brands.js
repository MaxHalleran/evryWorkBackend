Meteor.publish('brands', function (params) {
  let query = (params && params.query)?params.query:{};
  let options = (params && params.options)?params.options:{};
  return Brands.find(query, options);
});

Meteor.publish('brand', function (brandId) {
  return Brands.find({_id: brandId});
});
