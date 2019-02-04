import SimpleSchema from 'simpl-schema';

if(typeof Schema === 'undefined'){
  Schema = {};
}

Schema.Statuses = new SimpleSchema({
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
  userId: {
    type: String,
    autoValue: function() {
      if(this.userId && !this.isSet){
        return this.userId;
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
  image: {
    type: String,
    optional: true,
  },
  imageUploading: {
    type: Boolean,
    defaultValue: false,
  },
  public: {
    type: Boolean,
    defaultValue: true,
  },
});

Statuses = new Mongo.Collection('statuses');

Statuses.attachSchema(Schema.Statuses);

Statuses.helpers({

});

Statuses.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});
