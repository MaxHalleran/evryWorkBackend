import SimpleSchema from 'simpl-schema';

if(typeof Schema === 'undefined'){
  Schema = {};
}

Schema.Categories = new SimpleSchema({
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
  showNav: {
    type: Boolean,
    defaultValue: false,
  },
  description: {
    type: String,
    optional: true,
  },
  browseNode: {
    type: String,
    optional: true,
  },
  children: {
    type: Array,
    optional: true,
  },
    'children.$': {
      type: String,
      optional: true,
    },
});

Categories = new Mongo.Collection('categories');

Categories.attachSchema(Schema.Categories);

Categories.helpers({

});

Categories.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});
