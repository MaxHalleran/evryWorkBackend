import { FilesCollection } from 'meteor/ostrio:files';
import SimpleSchema from 'simpl-schema';
import S3 from 'aws-sdk/clients/s3';
import fs from 'fs';
import { Random } from 'meteor/random';

if(typeof Schema === 'undefined'){
  Schema = {};
}

Schema.Image = {
  ...FilesCollection.schema,
  'meta.directions': {
    type: Object,
    optional: true,
    blackbox: true,
  },
};

Images = new FilesCollection({
  collectionName: 'images',
  allowClientCode: false,
  debug: false,
  storagePath: 'assets/app/uploads',
  schema: Schema.Image,
  onBeforeUpload: (fileRef) => {
    if (!(fileRef.size <= 10485760 && /png|jpg|jpeg/i.test(fileRef.extension))) {
      return 'Please upload image, with size equal or less than 10MB';
    }

    if(!Meteor.userId()){
      return 'You must be logged in';
    }

    if(!fileRef.meta.directions || !fileRef.meta.directions.type){
      return 'Unspecified file uploads not allowed';
    }else{
      switch(fileRef.meta.directions.type){
        case 'productPhoto':
          var product = Products.findOne(fileRef.meta.directions.productId);
          if(!product){
            return 'Invalid product';
          }
          if(!Meteor.user().isAdmin()){
            return 'You do not have permission to do this';
          }
          if(typeof fileRef.meta.directions.imagePosition == 'undefined'){
            return 'Image position required';
          }
          return true;
          break;
        case 'userAvatar':
          var user = Meteor.users.findOne(fileRef.meta.directions.userId);
          if(!user){
            return 'Invalid user';
          }

          if(!Meteor.user() || (!Meteor.userId() == fileRef.meta.directions.userId && !Meteor.user().isAdmin())){
            return 'You do not have permission to do this';
          }
          return true;
          break;
        case 'statusPhoto':
          var status = Statuses.findOne(fileRef.meta.directions.statusId)
          if(!status){
            return 'Invalid status';
          }
          if(!Meteor.user() || (!Meteor.userId() == status.userId && !Meteor.user().isAdmin())){
            return 'You do not have permission to do this';
          }
          return true;
          break;
        default:
          return 'Unspecified file uploads not allowed';
      }
    }
    return false;
  }
});
Images.collection.attachSchema(new SimpleSchema(Schema.Image));

if(Meteor.isServer){
  Images.denyClient();

  const s3Conf = Meteor.settings.apiKeys.s3 || {};
  const MeteorBind  = Meteor.bindEnvironment((callback) => {
    return callback();
  });
  Images.onAfterUpload = (fileRef) => {
    if (s3Conf && s3Conf.key && s3Conf.secret && s3Conf.bucket && s3Conf.region) {
      const s3 = new S3({
        secretAccessKey: s3Conf.secret,
        accessKeyId: s3Conf.key,
        region: s3Conf.region,
        // sslEnabled: true, // optional
        httpOptions: {
          timeout: 6000,
          agent: false
        }
      });
      let filePath;
      switch(fileRef.meta.directions.type){
        case 'productPhoto':
          filePath = 'uploads/productPhotos/' + (Random.id()) + '.' + fileRef.extension;
          break;
        case 'userAvatar':
          filePath = 'uploads/userAvatars/' + (Random.id()) + '.' + fileRef.extension;
        break;
        case 'statusPhoto':
          filePath = 'uploads/statusPhotos/' + (Random.id()) + '.' + fileRef.extension;
        break;
        default:
          filePath = 'uploads/misc/' + (Random.id()) + '.' + fileRef.extension;
      }

      s3.upload({
        StorageClass: 'STANDARD',
        Bucket: s3Conf.bucket,
        Key: filePath,
        Body: fs.createReadStream(fileRef.path),
        ContentType: fileRef.type,
      }, (error,data) => {
        MeteorBind(() => {
          if(error){
            throw new Meteor.Error(error);
          }else{
            Images.collection.update(
              {_id: fileRef._id},
              {$set: {path: data.Location}}
            );
            switch(fileRef.meta.directions.type){
              case 'productPhoto':
                var product = Products.findOne(fileRef.meta.directions.productId);
                if(!product.images){
                  product.images = [];
                }
                product.images[fileRef.meta.directions.imagePosition] = {url: data.Location};
                Products.update(product._id, {$set: {images: product.images}});
              break;
              case 'userAvatar':
                var user = Meteor.users.findOne(fileRef.meta.directions.userId);
                if(!user.profile){
                  user.profile = {};
                }
                user.profile.avatar = data.Location;
                Meteor.users.update(user._id, {$set: {profile: user.profile}});
              break;
              case 'statusPhoto':
                Statuses.update(fileRef.meta.directions.statusId, {$set: {image: data.Location, imageUploading: false}});
              break;
            }

            //The image has been saved to S3, so lets delete from our local system
            fs.unlink(fileRef.path, err => {if (err) throw err;});
          }
        });
      });

    }

  }
}
