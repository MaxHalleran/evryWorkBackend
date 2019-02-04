import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { ToastContainer, toast } from 'react-toastify';
import * as _ from 'lodash';
import Select from 'react-select';

class EditProfileTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: {

      },
      email: "",
    };
  }

  static propTypes = {
    user: PropTypes.object,
    loading: PropTypes.bool,
  };

  static defaultProps = {
    loading: true,
  };

  componentDidUpdate = (prevProps, prevState) => {
    if(!this.props.loading && prevProps != this.props){
      let user = this.props.user;
      user.email = user.getEmail();
      this.setState({...prevState, user});
    }
  }

  updateProfileValue = (value, stateKey) => {
    let newState = this.state.profile?this.state.profile:{};
    newState[stateKey] = value;
    this.setState({profile: newState});
  }

  updateUserValue = (value, stateKey) => {
    let newState = this.state.user?this.state.user:{};
    newState[stateKey] = value;
    this.setState(newState);
  }

  submitHandler = (e) => {
    e.preventDefault();
    let user = _.cloneDeep(this.state.user);
    delete user._id;
    Meteor.call('user.update', user, this.props.user._id, error=>{
      if(error){
        toast.error(error.reason?error.reason:error);
      }else{
        toast.success('Profile updated');
        FlowRouter.go(`/profile/${this.state.user._id}`);
      }
    });
  }

  render(){
    return (
      <div>
        <h3>Profile</h3>
        <form onSubmit={this.submitHandler}>
          {!this.props.loading && this.state.user &&
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="text" id="email" className="form-control" value={this.state.user.email || ''} onChange={e=>{this.updateUserValue(e.target.value, 'email')}} />
            </div>
          }

          <h4>My Routines</h4>
          {this.props.loading &&
            <div>
              <p className="skeleton line"></p>
              <p className="skeleton line"></p>
              <p className="skeleton line"></p>
            </div>
          }
          {!this.props.loading && (!this.props.user.routines || this.props.user.routines.length == 0) &&
            <h5>No routines right now</h5>
          }
          {!this.props.loading && this.props.user.routines && this.props.user.routines.length &&
            <ul className="list-routines">
              {this.props.user.routines.map(r=>{
                const routine = Routines.findOne(r._id);
                if(routine){
                  return <li key={r._id}>{routine.name}<a href="" onClick={e=>{this.removeRoutine(r._id)}}> - Remove</a></li>;
                }
              })}
            </ul>
          }

          <input type="submit" className="btn btn-primary" value="Save" />
          <a href={!this.props.loading?`/profile/${this.props.user._id}/`:''} className="btn btn-secondary">Cancel</a>
        </form>
      </div>
    );
  }
};

export default withTracker(props => {
  let user = {};
  let loading = true;
  if(FlowRouter.getParam("userId") || Meteor.userId()){
    const handles = [
      Meteor.subscribe('routines'),
      Meteor.subscribe('tags'),
      Meteor.subscribe('products'),
      Meteor.subscribe('user', FlowRouter.getParam("userId")?FlowRouter.getParam("userId"):Meteor.userId()),
    ];
    loading = handles.some(handle => !handle.ready());
    user = Meteor.users.findOne(FlowRouter.getParam("userId")?FlowRouter.getParam("userId"):Meteor.userId());
  }else{
    FlowRouter.go('/');
  }

  return {
    user,
    loading,
  };
})(EditProfileTemplate);
