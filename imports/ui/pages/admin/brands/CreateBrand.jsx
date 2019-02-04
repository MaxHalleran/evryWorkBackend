import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { ToastContainer, toast } from 'react-toastify';

class CreateBrandTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      brand: {},
    };
  }

  static propTypes = {
    user: PropTypes.object,
    brand: PropTypes.object,
    loading: PropTypes.bool,
  };

  static defaultProps = {
    loading: true,
  };

  updateBrandValue = (value, stateKey) => {
    let newState = this.state.brand?this.state.brand:{};
    newState[stateKey] = value;
    this.setState({brand: newState});
  }

  submitHandler = (e) => {
    e.preventDefault();
    Meteor.call('brand.create', this.state.brand, (error, brandId)=>{
      if(error){
        toast.error(error.reason?error.reason:error);
      }else{
        FlowRouter.go(`/admin/brands/${brandId}`);
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
            <h3>New Brand</h3>
          </div>
          <div className="col-sm-4">
            <a href="/admin/brands" className="btn btn-secondary">Cancel</a>
          </div>
        </div>

        <form onSubmit={this.submitHandler} className="row">
          <div className="col-sm-2"></div>
          <div className="col-sm-8">
            <div className="form-group">
              <label htmlFor="name">brand Name</label>
              <input type="text" id="name" onChange={(e)=>this.updateBrandValue(e.target.value, 'name')} className="form-control" />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea id="description" onChange={(e)=>this.updateBrandValue(e.target.value, 'description')} className="form-control" />
            </div>
            <input type="submit" className="btn btn-primary" value="Add Brand"/>
          </div>
          <div className="col-sm-2"></div>
        </form>

      </div>
    );
  }
};

export default withTracker(props => {
  let user = {},
      loading = true;

  if(Meteor.userId()){
    const handles = [
      Meteor.subscribe('user'),
    ];
    loading = handles.some(handle => !handle.ready());
    user = Meteor.user();
  }else{
    FlowRouter.go('/');
  }

  return {
    user,
    loading,
  };
})(CreateBrandTemplate);
