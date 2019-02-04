import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { ToastContainer, toast } from 'react-toastify';
import * as _ from 'lodash';
import Checkbox from '/imports/ui/components/forms/components/Checkbox.jsx';

class EditCategoryTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category: props.category,
    };
  }

  static propTypes = {
    user: PropTypes.object,
    category: PropTypes.object,
    loading: PropTypes.bool,
  };

  static defaultProps = {
    loading: true,
    category: {},
    user: {},
  };

  updateCategoryValue = (value, stateKey) => {
    let newState = this.state.category?this.state.category:{};
    newState[stateKey] = value;
    this.setState({category: newState});
  }

  componentDidUpdate = (prevProps, prevState) => {
    if(!this.props.loading && prevProps != this.props){
      this.setState({...prevState,category: this.props.category});
    }
  }

  submitHandler = (e) => {
    e.preventDefault();
    let category = _.cloneDeep(this.state.category);
    delete category._id;
    Meteor.call('category.edit', this.state.category._id, category, (error, result)=>{
      if(error){
        toast.error(error.reason?error.reason:error);
      }else{
        toast.success('Category Saved')
        FlowRouter.go('/admin/categories');
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
            <h3>Edit Category</h3>
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
              <label htmlFor="name">Category Name</label>
              <input type="text" value={this.state.category.name || ''} onChange={(e)=>this.updateCategoryValue(e.target.value, 'name')} className="form-control" />
            </div>
            <div className="form-group">
              <Checkbox id="highlight" label="Highlight (Show in store)" checked={this.state.category.showNav} onChange={(e)=>this.updateCategoryValue(e.target.checked, 'showNav')} />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea id="description" value={this.state.category.description || ''} onChange={(e)=>this.updateCategoryValue(e.target.value, 'description')} className="form-control" />
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
      category = {},
      loading = true;

  if(Meteor.userId()){
    const handles = [
      Meteor.subscribe('category', FlowRouter.getParam("categoryId")),
      Meteor.subscribe('user'),
    ];
    loading = handles.some(handle => !handle.ready());
    user = Meteor.user();
    category = Categories.findOne(FlowRouter.getParam("categoryId"));
  }else{
    FlowRouter.go('/');
  }

  return {
    user,
    category,
    loading,
  };
})(EditCategoryTemplate);
