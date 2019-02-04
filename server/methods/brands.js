Meteor.methods({
  'brand.create': brand => {
    if(!Meteor.user() || !Meteor.user().isAdmin()){
      throw new Meteor.Error('access-denied', 'You do not have permission to do this');
    }
    return Brands.insert(brand);
  },
  'brand.edit': (brandId, brand) => {
    if(!Meteor.user() || !Meteor.user().isAdmin()){
      throw new Meteor.Error('access-denied', 'You do not have permission to do this');
    }
    return Brands.update(brandId, {$set: brand});
  },
  'brand.delete': (brandId) => {
    if(!Meteor.user() || !Meteor.user().isAdmin()){
      throw new Meteor.Error('access-denied', 'You do not have permission to do this');
    }
    return Brands.remove(brandId);
  },
});
