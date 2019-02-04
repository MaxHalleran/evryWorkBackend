import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { ToastContainer, toast } from 'react-toastify';
import * as _ from 'lodash';
import Select from 'react-select';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Checkbox from '/imports/ui/components/forms/components/Checkbox.jsx';

class CreateProductsTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product: {
        features: [''],
      },
      images: [{url: ''}],
    };
  }

  static propTypes = {
    user: PropTypes.object,
    product: PropTypes.object,
    loading: PropTypes.bool,
  };

  static defaultProps = {
    loading: true,
  };

  updateProductValue = (value, stateKey) => {
    let newState = this.state.product?this.state.product:{};
    newState[stateKey] = value;
    this.setState({product: newState});
  }

  updateTags = (value, stateKey) => {
    let newState = this.state.product?this.state.product:{};
    newState[stateKey] = value;
    this.setState({product: newState});
  }

  removeFeature = index => {
    let newState = _.cloneDeep(this.state.product?this.state.product:{});
    if(!newState.features){
      newState.features = [];
    }
    if(newState.features.length > 1){
      newState.features.splice(index, 1);
      this.setState({product: newState});
    }
  }

  addFeature = index => {
    let newState = _.cloneDeep(this.state.product?this.state.product:{});
    if(!newState.features){
      newState.features = [];
    }
    newState.features.splice(index+1, 0, '');
    this.setState({product: newState});
  }

  updateFeatureValue = (value, index) => {
    let newState = this.state.product?this.state.product:{};
    if(!newState.features){
      newState.features = [];
    }
    newState.features[index] = value;
    newState[stateKey] = value;
    this.setState({product: newState});
  }

  removeImage = index => {
    let newState = _.cloneDeep(this.state.images?this.state.images:[]);
    if(newState.length > 1){
      newState.splice(index, 1);
      this.setState({images: newState});
    }
  }

  addImage = index => {
    let newState = _.cloneDeep(this.state.images?this.state.images:[]);
    newState.splice(index+1, 0, {url: ''});
    this.setState({images: newState});
  }

  selectedImage = (event, index) => {
    let newState = _.cloneDeep(this.state.images?this.state.images:[]);
    newState[index] = {url: 'test', data: event.target.files};
    this.setState({images: newState});
  }

  uploadImage = (files, imageType, var1, var2) => {
    return new Promise((resolve, reject)=>{
      if(files){
        const file = files[0];
        let uploadSettings = {
          file:  file,
          streams: 'dynamic',
          chunkSize: 'dynamic',
        };

        switch(imageType){
          case 'productPhoto':
            uploadSettings.meta = {
              directions: {
                type: imageType,
                productId: var1,
                imagePosition: var2
              },
            };
            break;
        }

        const upload = Images.insert(uploadSettings, false);

        upload.on('start', function () {
          //toast.info('Uploading...');
          console.log('Uploading: ', this);
        });

        upload.on('end', (error, a) => {
          if (error) {
            toast.error(error.message);
            reject(error);
          } else {
            resolve(a);
            var reader = new FileReader();
            reader.onload = (e) => {
               /*mixpanel.track(
                 "Uploaded profile image",
                 {
                   imageType
                 }
               );
               $scope.$apply(()=>{
                 if(imageType == 'userAvatar'){
                   $rootScope.$emit('updateAvatar', e.target.result);
                 }
                 $scope.data.user.profile[varName] = e.target.result;
               });*/

            }
            reader.readAsDataURL(file);
          }
        });
        upload.start();
      }else{
        reject();
      }
    });
  };

  submitHandler = (e) => {
    e.preventDefault();
    let product = _.cloneDeep(this.state.product);
    delete product._id;
    if(product.tags){
      product.tags = product.tags.map(tag=>tag.value);
    }
    if(product.categories){
      product.categories = product.categories.map(category=>category.value);
    }
    Meteor.call('product.create', product, (error, productId)=>{
      if(error){
        toast.error(error.reason?error.reason:error);
      }else{
        if(this.state.images && this.state.images.length > 0){
          toast.info('Uploading images...');
          new Promise((resolve, reject)=>{
            for(let i = 0; i<this.state.images.length; i++){
              this.uploadImage(this.state.images[i].data, 'productPhoto', productId, i).then(()=>{
                if(i==(this.state.images.length - 1)){
                  toast.success('Images uploaded');
                  resolve();
                }
              });
            }
          }).then(()=>{
            FlowRouter.go(`/admin/products/${productId}`);
          });
        }else{
          FlowRouter.go(`/admin/products/${productId}`);
        }

      }
    });

  }

  render(){
    if(!this.props.loading && !this.props.user.isAdmin()){
      FlowRouter.go('/');
    }
    return (
      <div>
        <div className="row">
          <div className="col-sm-4">
            <h3>New Product</h3>
          </div>
          <div className="col-sm-4">
            <a href="/admin/products" className="btn btn-secondary">Cancel</a>
          </div>
        </div>

        <form onSubmit={this.submitHandler} className="row">
          <div className="col-sm-2"></div>
          <div className="col-sm-8">
            <div className="form-group">
              <label htmlFor="name">Product Name</label>
              <input type="text" id="name" onChange={(e)=>this.updateProductValue(e.target.value, 'name')} className="form-control" />
            </div>
            <div className="form-group">
            <label>Description</label>
            <ReactQuill onChange={value=>this.updateProductValue(value, 'description')} />
            </div>
            <div className="form-group">
              <label htmlFor="ingredients">Ingredients</label>
              <textarea id="ingredients" onChange={(e)=>this.updateProductValue(e.target.value, 'ingredients')} className="form-control" />
            </div>
            <div className="form-group">
              <label htmlFor="buyLink">Buy Link</label>
              <input type="text" id="buyLink" onChange={(e)=>this.updateProductValue(e.target.value, 'buyLink')} className="form-control" />
            </div>
            <div className="form-group">
              <Checkbox id="highlight" label="Highlight (Show in store)" checked={this.state.product.highlight} onChange={(e)=>this.updateProductValue(e.target.checked, 'highlight')} />
            </div>
            <div className="image-gallery-upload">
              {this.state.images.map((image, index)=>{
                return <div key={index}>
                  <input type="file" onChange={(e)=>{this.selectedImage(e, index)}}/>
                  <a href="" onClick={e=>(this.addImage(index))}>Add Another Image</a>
                  <a href="" onClick={e=>(this.removeImage(index))}>Remove Image</a>
                </div>;
              })}
            </div>
            <div className="form-group">
              <label htmlFor="brand">Brand</label>
              <input type="text" id="brand" onChange={(e)=>this.updateProductValue(e.target.value, 'brand')} className="form-control" />
            </div>

            <div className="form-group">
              <label>Features</label>
              {!this.props.loading && this.state.product.features && this.state.product.features.map((feature, index)=>{
                return <div key={index}>
                  <textarea className="form-control" value={feature||''} onChange={(e)=>{this.updateFeatureValue(e.target.value, index)}} />
                  <a href="" onClick={e=>(this.addFeature(index))}>Add Another Feature</a>
                  <a href="" onClick={e=>(this.removeFeature(index))}>Remove Feature</a>
                </div>;
              })}
            </div>

            <div className="form-group">
              <h5>Categories</h5>
              <Select
                value={this.state.product.categories && this.state.product.categories.map(category=>{
                  if(typeof category == 'string'){
                    category = {value: category, label: '', key: category};
                  }
                  return category;
                })}
                isMulti={true}
                onChange={value=>this.updateProductValue(value, 'categories')}
                options={this.props.categories.map(category=>{return {value: category._id, label: category.name};})}
              />
            </div>
            <div className="form-group">
              <h5>Tags</h5>
              <Select
                value={this.state.product.tags && this.state.product.tags.map(tag=>{
                  if(typeof tag == 'string'){
                    tag = {value: tag, label: '', key: tag};
                  }
                  return tag;
                })}
                isMulti={true}
                onChange={value=>this.updateTags(value, 'tags')}
                options={this.props.tags.map(tag=>{return {value: tag._id, label: tag.name};})}
              />
            </div>
            <input type="submit" className="btn btn-primary" value="Add Product"/>
          </div>
          <div className="col-sm-2"></div>
        </form>

      </div>
    );
  }
};

export default withTracker(props => {
  let user = {},
      tags = [],
      brands,
      categories,
      loading = true;

  if(Meteor.userId()){
    const handles = [
      Meteor.subscribe('user'),
      Meteor.subscribe('tags'),
      Meteor.subscribe('categories'),
      Meteor.subscribe('brands'),
      Meteor.subscribe('products'),
    ];
    loading = handles.some(handle => !handle.ready());
    user = Meteor.user();
    tags = Tags.find().fetch();
    brands = Brands.find().fetch();
    categories = Categories.find().fetch();
  }else{
    FlowRouter.go('/');
  }

  return {
    user,
    tags,
    brands,
    categories,
    loading,
  };
})(CreateProductsTemplate);
