import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { ToastContainer, toast } from 'react-toastify';
import * as _ from 'lodash';

class EditProfileTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: {

      },
    };
  }

  static propTypes = {
    user: PropTypes.object,
    userId: PropTypes.string,
    settings: PropTypes.object,
    successCallback: PropTypes.func,
    errorCallback: PropTypes.func,
    cancelCallback: PropTypes.func,
  };

  static defaultProps = {
    settings: {
      showName: true,
      showEmail: true,
    },
    successCallback: ()=>{
      toast.success('Status Posted!');
    },
    errorCallback: (error)=>{
      if(!error){error={}};
      toast.error(error.reason?error.reason:error);
    },
  };

  updateProfileValue = (value, stateKey) => {
    let newState = this.state.profile?this.state.profile:{};
    newState[stateKey] = value;
    this.setState({profile: newState});
  }


  componentDidUpdate = (prevProps, prevState) => {
    if(!this.props.loading && prevProps != this.props){
      this.setState({profile: {
        firstName: this.props.user.getFirstName(),
        lastName: this.props.user.getLastName(),
        email: this.props.user.getEmail()
      }});
    }
  }

  componentDidMount = () => {
    if(this.props.user && !this.props.userId){
      this.setState({profile: {
        firstName: this.props.user.getFirstName(),
        lastName: this.props.user.getLastName(),
        email: this.props.user.getEmail()
      }});
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    let profile = _.cloneDeep(this.state.profile);

    Meteor.call('user.updateProfile', profile, this.props.user._id, error=>{
      if(error){
        this.props.errorCallback(error);
      }else{
        this.setState({profile: {}});
        this.props.successCallback();
      }
    });
  }

  render(){

    return (
      <form onSubmit={this.handleSubmit} className="profile edit">
        {!this.props.loading && this.props.settings.showName &&
          <div className="row form-group">
            <div className="col-sm-6">
              <label htmlFor="firstName">First Name</label>
              <input type="text" id="firstName" value={this.state.profile.firstName || ''} onChange={e=>{this.updateProfileValue(e.target.value, 'firstName')}} className="form-control" />
            </div>
            <div className="col-sm-6">
              <label htmlFor="lastName">Last Name</label>
              <input type="text" id="lastName" value={this.state.profile.lastName || ''} onChange={e=>{this.updateProfileValue(e.target.value, 'lastName')}} className="form-control" />
            </div>
          </div>
        }

        {!this.props.loading && this.props.settings.showEmail &&
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" value={this.state.profile.email || ''} onChange={e=>{this.updateProfileValue(e.target.value, 'email')}} className="form-control" />
          </div>
        }

        <div className="spacer v20"></div>
        <input type="submit" className="btn btn-primary" value="Save" /> &nbsp;
        {this.props.cancelCallback && <a href="" className="btn btn-secondary" onClick={this.props.cancelCallback}>Cancel</a>}
      </form>
    );
  }
};

export default withTracker(props => {
  let loading = true,
      user = {};
  const handles = [];
  if(props.userId){
    handles.push(Meteor.subscribe('user', props.userId));
    user = Meteor.users.findOne(props.userId);
    loading = handles.some(handle => !handle.ready());
  }else{
    user = props.user;
    loading = false;
  }



  return {
    loading,
    user,
  };
})(EditProfileTemplate);
