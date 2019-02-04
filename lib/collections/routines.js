import SimpleSchema from 'simpl-schema';

if(typeof Schema === 'undefined'){
  Schema = {};
}

Schema.Routines = new SimpleSchema({
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
  author: {
    type: String,
    autoValue: function() {
      if(Meteor.userId() && !this.isSet){
        return Meteor.userId();
      }
    }
  },
  updatedAt: {
    type: Date,
    autoValue: function() {
      return new Date;
    }
  },
  name: {
    type: String,
  },
  description: {
    type: String,
    optional: true,
  },
  buyLink: {
    type: String,
    optional: true,
  },
  steps: {
    type: Array,
    optional: true,
  },
    'steps.$': {
      type: Object,
      optional: true,
    },
      'steps.$.name': {
        type: String,
        optional: true,
      },
      'steps.$.description': {
        type: String,
        optional: true,
      },
      'steps.$.product': {
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
});

Routines = new Mongo.Collection('routines');

Routines.attachSchema(Schema.Routines);

Routines.helpers({
  canEdit(){
    return (Meteor.userId() && (this.author == Meteor.userId() || Meteor.user().isAdmin()));
  },
});

Routines.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});
