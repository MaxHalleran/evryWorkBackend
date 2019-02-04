import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { ToastContainer, toast } from 'react-toastify';
import Checkbox from '/imports/ui/components/forms/components/Checkbox.jsx';

class CreateCategoryTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category: {},
    };
  }

  static propTypes = {
    user: PropTypes.object,
    category: PropTypes.object,
    loading: PropTypes.bool,
  };

  static defaultProps = {
    loading: true,
  };

  updatecategoryValue = (value, stateKey) => {
    let newState = this.state.category?this.state.category:{};
    newState[stateKey] = value;
    this.setState({category: newState});
  }

  submitHandler = (e) => {
    e.preventDefault();
    Meteor.call('category.create', this.state.category, (error, categoryId)=>{
      if(error){
        toast.error(error.reason?error.reason:error);
      }else{
        FlowRouter.go(`/admin/categories/${categoryId}`);
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
            <h3>New Category</h3>
          </div>
          <div className="col-sm-4">
            <a href="/admin/categories" className="btn btn-secondary">Cancel</a>
          </div>
        </div>

        <form onSubmit={this.submitHandler} className="row">
          <div className="col-sm-2"></div>
          <div className="col-sm-8">
            <div className="form-group">
              <label htmlFor="name">Category Name</label>
              <input type="text" id="name" onChange={(e)=>this.updatecategoryValue(e.target.value, 'name')} className="form-control" />
            </div>
            <div className="form-group">
              <Checkbox id="highlight" label="Highlight (Show in store)" checked={this.state.category.showNav} onChange={(e)=>this.updateCategoryValue(e.target.checked, 'showNav')} />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea id="description" onChange={(e)=>this.updateCategoryValue(e.target.value, 'description')} className="form-control" />
            </div>
            <input type="submit" className="btn btn-primary" value="Add Category"/>
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
})(CreateCategoryTemplate);
