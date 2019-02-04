import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { ToastContainer, toast } from 'react-toastify';
import * as _ from 'lodash';

class EditTagTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tag: props.tag,
    };
  }

  static propTypes = {
    user: PropTypes.object,
    tag: PropTypes.object,
    loading: PropTypes.bool,
  };

  static defaultProps = {
    loading: true,
    tag: {},
    user: {},
  };

  updateTagValue = (value, stateKey) => {
    let newState = this.state.tag?this.state.tag:{};
    newState[stateKey] = value;
    this.setState({tag: newState});
  }

  componentDidUpdate = (prevProps, prevState) => {
    if(!this.props.loading && prevProps != this.props){
      this.setState({...prevState,tag: this.props.tag});
    }
  }

  submitHandler = (e) => {
    e.preventDefault();
    let tag = _.cloneDeep(this.state.tag);
    delete tag._id;
    Meteor.call('tag.edit', this.state.tag._id, tag, (error, result)=>{
      if(error){
        toast.error(error.reason?error.reason:error);
      }else{
        toast.success('Tag Saved')
        FlowRouter.go('/admin/tags');
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
            <h3>Edit Tag</h3>
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
              <label htmlFor="name">Tag Name</label>
              <input type="text" value={this.state.tag.name || ''} onChange={(e)=>this.updateTagValue(e.target.value, 'name')} className="form-control" />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea id="description" value={this.state.tag.description || ''} onChange={(e)=>this.updateTagValue(e.target.value, 'description')} className="form-control" />
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
      tag = {},
      loading = true;

  if(Meteor.userId()){
    const handles = [
      Meteor.subscribe('tag', FlowRouter.getParam("tagId")),
      Meteor.subscribe('user'),
    ];
    loading = handles.some(handle => !handle.ready());
    user = Meteor.user();
    tag = Tags.findOne(FlowRouter.getParam("tagId"));
  }else{
    FlowRouter.go('/');
  }

  return {
    user,
    tag,
    loading,
  };
})(EditTagTemplate);
