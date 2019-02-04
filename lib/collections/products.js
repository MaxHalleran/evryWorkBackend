import SimpleSchema from 'simpl-schema';

if(typeof Schema === 'undefined'){
  Schema = {};
}

Schema.Products = new SimpleSchema({
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
  status: {
    type: String,
    defaultValue: 'published',
  },
  highlight: {
    type: Boolean,
    defaultValue: false,
  },
  buyLink: {
    type: String,
    optional: true,
  },
  ingredients: {
    type: String,
    optional: true,
  },
  asin: {
    type: String,
    optional: true,
  },
  productGroup: {
    type: String,
    optional: true,
  },
  salesRank: {
    type: String,
    optional: true,
  },
  features: {
    type: Array,
    optional: true,
  },
    'features.$': {
      type: String,
      optional: true,
    },
  images: {
    type: Array,
    optional: true,
  },
    'images.$': {
      type: Object,
      optional: true,
    },
      'images.$.url': {
        type: String,
        optional: true,
      },
  categories: {
    type: Array,
    optional: true,
  },
    'categories.$': {
      type: String,
      optional: true,
    },
  brand: {
    type: String,
    optional: true,
  },
  tags: {
    type: Array,
    optional: true,
  },
    'tags.$': {
      type: String,
      optional: true,
    },
  description: {
    type: String,
    optional: true,
  },
});

Products = new Mongo.Collection('products');

Products.attachSchema(Schema.Products);

Products.helpers({

});

if (Meteor.isServer) {
    Products._ensureIndex(
        {
          'name': 'text',
          'brand': 'text',
        }
    );
}

Products.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});
