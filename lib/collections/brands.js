import SimpleSchema from 'simpl-schema';

if(typeof Schema === 'undefined'){
  Schema = {};
}

Schema.Brands = new SimpleSchema({
  createdAt: {
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return new Date;
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date};
      } else {
        this.unset();
      }
    }
  },
  name: {
    type: String,
    optional: true,
  },
  description: {
    type: String,
    optional: true,
  },
});

Brands = new Mongo.Collection('brands');

Brands.attachSchema(Schema.Brands);

Brands.helpers({

});

Brands.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});
