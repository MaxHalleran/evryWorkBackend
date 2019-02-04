import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { ToastContainer, toast } from 'react-toastify';
import * as _ from 'lodash';

class EditBrandTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      brand: props.brand,
    };
  }

  static propTypes = {
    user: PropTypes.object,
    brand: PropTypes.object,
    loading: PropTypes.bool,
  };

  static defaultProps = {
    loading: true,
    brand: {},
    user: {},
  };

  updateBrandValue = (value, stateKey) => {
    let newState = this.state.brand?this.state.brand:{};
    newState[stateKey] = value;
    this.setState({brand: newState});
  }

  componentDidUpdate = (prevProps, prevState) => {
    if(!this.props.loading && prevProps != this.props){
      this.setState({...prevState,brand: this.props.brand});
    }
  }

  submitHandler = (e) => {
    e.preventDefault();
    let brand = _.cloneDeep(this.state.brand);
    delete brand._id;
    Meteor.call('brand.edit', this.state.brand._id, brand, (error, result)=>{
      if(error){
        toast.error(error.reason?error.reason:error);
      }else{
        toast.success('Brand Saved')
        FlowRouter.go('/admin/brands');
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
            <h3>Edit Brand</h3>
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
              <label htmlFor="name">Brand Name</label>
              <input type="text" value={this.state.brand.name || ''} onChange={(e)=>this.updateBrandValue(e.target.value, 'name')} className="form-control" />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea id="description" value={this.state.brand.description || ''} onChange={(e)=>this.updateBrandValue(e.target.value, 'description')} className="form-control" />
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
      brand = {},
      loading = true;

  if(Meteor.userId()){
    const handles = [
      Meteor.subscribe('brand', FlowRouter.getParam("brandId")),
      Meteor.subscribe('user'),
    ];
    loading = handles.some(handle => !handle.ready());
    user = Meteor.user();
    brand = Brands.findOne(FlowRouter.getParam("brandId"));
  }else{
    FlowRouter.go('/');
  }

  return {
    user,
    brand,
    loading,
  };
})(EditBrandTemplate);
