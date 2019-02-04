import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { ToastContainer, toast } from 'react-toastify';

class CreateTagTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tag: {},
    };
  }

  static propTypes = {
    user: PropTypes.object,
    tag: PropTypes.object,
    loading: PropTypes.bool,
  };

  static defaultProps = {
    loading: true,
  };

  updateTagValue = (value, stateKey) => {
    let newState = this.state.tag?this.state.tag:{};
    newState[stateKey] = value;
    this.setState({tag: newState});
  }

  submitHandler = (e) => {
    e.preventDefault();
    Meteor.call('tag.create', this.state.tag, (error, tagId)=>{
      if(error){
        toast.error(error.reason?error.reason:error);
      }else{
        FlowRouter.go(`/admin/tag/${tagId}`);
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
            <h3>New Tag</h3>
          </div>
          <div className="col-sm-4">
            <a href="/admin/tags" className="btn btn-secondary">Cancel</a>
          </div>
        </div>

        <form onSubmit={this.submitHandler} className="row">
          <div className="col-sm-2"></div>
          <div className="col-sm-8">
            <div className="form-group">
              <label htmlFor="name">Tag Name</label>
              <input type="text" id="name" onChange={(e)=>this.updateTagValue(e.target.value, 'name')} className="form-control" />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea id="description" onChange={(e)=>this.updateTagValue(e.target.value, 'description')} className="form-control" />
            </div>
            <input type="submit" className="btn btn-primary" value="Add Tag"/>
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
})(CreateTagTemplate);
