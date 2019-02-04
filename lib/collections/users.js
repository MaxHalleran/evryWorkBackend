import SimpleSchema from 'simpl-schema';

if(typeof Schema === 'undefined'){
  Schema = {};
}

var profileSchema = new SimpleSchema({
  firstName: {
    type: String,
    optional: true,
  },
  lastName: {
    type: String,
    optional: true,
  },
  phone: {
    type: String,
    optional: true,
  },
  avatar: {
    type: String,
    optional: true,
  },
  receiveNewsletter: {
    type: Boolean,
    defaultValue: false,
  },
  address: {
    optional: true,
    type: new SimpleSchema({
      street: {
        type: String,
        optional: true,
      },
      city: {
        type: String,
        optional: true,
      },
      province: {
        type: String,
        optional: true,
      },
      country: {
        type: String,
        optional: true,
      },
      postalCode: {
        type: String,
        optional: true,
      },
    }),
  },
});

Schema.Users = new SimpleSchema({
  emails: {
      type: Array,
      optional: true,
  },
  'emails.$': {
      type: Object,
      optional: true,
  },
  'emails.$.address': {
      type: String,
      regEx: SimpleSchema.RegEx.Email,
      //optional: true,
  },
  'emails.$.verified': {
      type: Boolean,
      optional: true,
  },
  twoFactorCode: {
    type: String,
    optional: true,
  },
  recognizedDevices: {
    type: Array,
    optional: true,
  },
  'recognizedDevices.$': {
    type: Object,
    optional: true,
  },
  'recognizedDevices.$.fingerprint': {
    type: String,
    optional: true,
  },
  'recognizedDevices.$.dateAdded': {
    type: Date,
    optional: true,
  },
  status: {
    type: SimpleSchema.oneOf(String, Boolean),
    optional: true,
  },
  createdAt: {
    type: Date,
    autoValue: function() {
      if (this.isUpsert) {
        return {$setOnInsert: new Date};
      } else {
        return new Date;
      }
    }
  },
  updatedAt: {
    type: Date,
    optional: true,
  },
  redirect: {
    type: SimpleSchema.oneOf(String, Object),
    optional: true,
  },
  'redirect.template': {
    type: String,
    optional: true,
  },
  'redirect.params': {
    type: Object,
    blackbox: true,
    optional: true,
  },
  routines: {
    type: Array,
    optional: true,
  },
    'routines.$': {
      type: Object,
      optional: true,
    },
      'routines.$._id': {
        type: String,
        optional: true,
      },
      'routines.$.date': {
        type: Date,
        optional: true,
      },
  profile: {
    type: profileSchema,
    optional: true,
  },
  services: {
    type: Object,
    optional: true,
    blackbox: true
  },
  admin: {
    type: Boolean,
    defaultValue: false,
  }
});

Meteor.users.attachSchema(Schema.Users);

if (Meteor.isServer) {
    Meteor.users._ensureIndex(
        {
          'profile.firstName': 'text',
          'profile.lastName': 'text',
        }
    );
}

Meteor.users.helpers({
  isAdmin(){
    return this.admin;
  },
  getEmail(){
    if(this.emails && this.emails[0] && this.emails[0].address){
      return this.emails[0].address;
    }else{
      return '';
    }
  },
  getFirstName(){
    if(this.profile && this.profile.firstName){
      return this.profile.firstName;
    }else if(this.services && this.services.google && this.services.google.given_name){
      return this.services.google.given_name;
    }else if(this.services && this.services.facebook && this.services.facebook.first_name){
      return this.services.facebook.first_name;
    }else if(this.services && this.services.linkedin && this.services.linkedin.firstName){
      return this.services.linkedin.firstName;
    }else{
      return '';
    }
  },
  getLastName(){
    if(this.profile && this.profile.lastName){
      return this.profile.lastName;
    }else if(this.services && this.services.google && this.services.google.family_name){
      return this.services.google.family_name;
    }else if(this.services && this.services.facebook && this.services.facebook.last_name){
      return this.services.facebook.last_name;
    }else if(this.services && this.services.linkedin && this.services.linkedin.lastName){
      return this.services.linkedin.lastName;
    }else{
      return '';
    }
  },
  getStatusImage(){
    //Status must be published if using on client
    let query = {userId: this._id, image: {$exists: true, $ne: null } };
    if(!Meteor.userId() || Meteor.userId() != this._id){
      query.public = true;
    }
    let status = Statuses.findOne(query, {sort: {createdAt: -1}});
    if(!status){
      return '';
    }else{
      return status.image;
    }
  },
  verifiedEmail(){
    return ((this.emails && this.emails[0].verified) || this.services.google || this.services.facebook || this.services.linkedin);
  },
  isProfileComplete(){
    if(this.getEmail() && this.getFirstName() && this.getLastName() && this.profile && this.profile.address
    && this.profile.address.countryCode && this.profile.address.country && this.profile.address.province
    && this.profile.address.postalCode && this.profile.address.city && this.profile.address.street){
      return true;
    }else{
      return false;
    }
  },
  hasRoutine(routineId){
    if(this.routines){
      for(let r = 0; r<this.routines.length; r++){
        if(this.routines[r]._id == routineId){
          return true;
        }
      }
      return false;
    }else{
      return false;
    }
  },
});

Meteor.users.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});
