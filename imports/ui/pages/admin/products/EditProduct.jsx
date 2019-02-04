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

class EditProductsTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product: props.product,
    };
  }

  static propTypes = {
    user: PropTypes.object,
    product: PropTypes.object,
    loading: PropTypes.bool,
  };

  static defaultProps = {
    loading: true,
    product: {},
    user: {},
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

  componentDidUpdate = (prevProps, prevState) => {
    if(!this.props.loading && prevProps != this.props){
      if(this.props.product && this.props.product.tags){
        this.props.product.tags = this.props.product.tags.map(tag=>{
          return {value: tag, label: Tags.findOne(tag).name, key: tag};
        });
      }

      if(this.props.product && this.props.product.categories){
        this.props.product.categories = this.props.product.categories.map(category=>{
          return {value: category, label: Categories.findOne(category).name, key: category};
        });
      }

      if(!this.props.product.images || this.props.product.images.length ==0){
        this.props.product.images = [{url: ''}];
      }
      this.setState({...prevState,product: this.props.product});
    }
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
            toast.success('Image saved');
            reader.onload = (e) => {

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

  removeImage = index => {
    let newState = _.cloneDeep(this.state.product?this.state.product:{});
    if(!newState.images){
      newState.images = [];
    }
    if(newState.images.length > 1){
      newState.images.splice(index, 1);
      this.setState({product: newState});
    }
  }

  addImage = index => {
    let newState = _.cloneDeep(this.state.product?this.state.product:{});
    if(!newState.images){
      newState.images = [];
    }
    newState.images.splice(index+1, 0, {url: ''});
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
    Meteor.call('product.edit', this.state.product._id, product, (error, result)=>{
      if(error){
        toast.error(error.reason?error.reason:error);
      }else{
        toast.success('Product Saved')
        FlowRouter.go('/admin/products');
      }
    });
  }

  render(){
    if(!this.props.loading && !this.props.user.isAdmin()){
      FlowRouter.go('/');
    }
    console.log('product', this.state.product);
    return (
      <div>
        <div className="row">
          <div className="col-sm-4">
            <h3>Edit Product</h3>
          </div>
        </div>
        {this.props.loading &&
          <div>
            <p>Loading...</p>
          </div>
        }
        {!this.props.loading && <form onSubmit={this.submitHandler} className="row">
          <div className="col-sm-2"></div>
          <div className="col-sm-8">
            <div className="form-group">
              <label htmlFor="name">Product Name</label>
              <input type="text" value={this.state.product.name || ''} onChange={(e)=>this.updateProductValue(e.target.value, 'name')} className="form-control" />
            </div>
            <div className="form-group">
              <label>Description</label>
              <ReactQuill value={this.state.product.description || ''} onChange={value=>this.updateProductValue(value, 'description')} />
            </div>
            <div className="form-group">
              <label htmlFor="ingredients">Ingredients</label>
              <textarea id="ingredients" value={this.state.product.ingredients || ''} onChange={(e)=>this.updateProductValue(e.target.value, 'ingredients')} className="form-control" />
            </div>
            <div className="form-group">
              <label htmlFor="buyLink">Buy Link</label>
              <input type="text" id="buyLink" value={this.state.product.buyLink || ''} onChange={(e)=>this.updateProductValue(e.target.value, 'buyLink')} className="form-control" />
            </div>
            <div className="form-group">
              <Checkbox id="highlight" label="Highlight (Show in store)" checked={this.state.product.highlight} onChange={(e)=>this.updateProductValue(e.target.checked, 'highlight')} />
            </div>
            <div className="image-gallery-upload">
              {!this.props.loading && this.state.product.images && this.state.product.images.map((image, index)=>{
                return <div key={index}>
                  <img src={image.url} />
                  <input type="file" onChange={(e)=>{this.uploadImage(e.target.files, 'productPhoto', this.props.product._id, index)}}/>
                  <a href="" onClick={e=>(this.addImage(index))}>Add Another Image</a>
                  <a href="" onClick={e=>(this.removeImage(index))}>Remove Image</a>
                </div>;
              })}
            </div>
            <div className="form-group">
              <label htmlFor="brand">Brand</label>
              <input type="text" id="brand" value={this.state.product.brand || ''} onChange={(e)=>this.updateProductValue(e.target.value, 'brand')} className="form-control" />
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
                onChange={value=>this.updateProductValue(value, 'tags')}
                options={this.props.tags.map(tag=>{return {value: tag._id, label: tag.name};})}
              />
            </div>
            <input type="submit" className="btn btn-primary" value="Save"/>
          </div>
          <div className="col-sm-2"></div>
        </form>}

      </div>
    );
  }
};

export default withTracker(props => {
  let user = {},
      product = {},
      tags = [],
      categories = [],
      brands = [],
      loading = true;

  if(Meteor.userId()){
    const handles = [
      Meteor.subscribe('products'),
      Meteor.subscribe('brands'),
      Meteor.subscribe('categories'),
      Meteor.subscribe('tags'),
      Meteor.subscribe('user'),
    ];
    loading = handles.some(handle => !handle.ready());
    user = Meteor.user();
    tags = Tags.find().fetch();
    brands = Brands.find().fetch();
    categories = Categories.find().fetch();
    product = Products.findOne(FlowRouter.getParam("productId"));
  }else{
    FlowRouter.go('/');
  }

  return {
    user,
    product,
    brands,
    categories,
    tags,
    loading,
  };
})(EditProductsTemplate);
