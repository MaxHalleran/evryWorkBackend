import SimpleSchema from 'simpl-schema';

if(typeof Schema === 'undefined'){
  Schema = {};
}

Schema.Tags = new SimpleSchema({
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
  },
  description: {
    type: String,
    optional: true,
  },
});

Tags = new Mongo.Collection('tags');

Tags.attachSchema(Schema.Tags);

Tags.helpers({

});

Tags.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});
