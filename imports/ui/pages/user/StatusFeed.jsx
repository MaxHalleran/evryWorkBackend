import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { ToastContainer, toast } from 'react-toastify';
import { Modal } from 'react-bootstrap';
import * as _ from 'lodash';
import CreateStatus from '/imports/ui/components/forms/status/CreateStatus';
import ViewStatusList from '/imports/ui/components/displays/ViewStatusList';

class StatusFeedTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modals: {
        createStatus: {
          show: false
        },
        editProfile: {
          show: false
        },
      },
    };
  }

  static propTypes = {
    user: PropTypes.object,
    loading: PropTypes.bool,
  };

  static defaultProps = {
    loading: true,
  };

  closeModal = modalId => {
    let modals = _.cloneDeep(this.state.modals);
    modals[modalId].show = false;
    this.setState({modals});
  }

  openModal = modalId => {
    let modals = _.cloneDeep(this.state.modals);
    modals[modalId].show = true;
    this.setState({modals});
  }

  render(){
    return (
      <div className="row">
        <div className="col-sm-2"></div>
        <div className="col-sm-8">
          {this.props.loading?<p className="skeleton line"></p>:<h3>{this.props.user.getFirstName()} {this.props.user.getLastName()} - Status Feed &nbsp; {!this.props.loading && (Meteor.userId() && (this.props.user._id == Meteor.userId() || this.props.user.isAdmin())) && <a href="" className="btn btn-primary" onClick={()=>this.openModal('createStatus')}>Create Status</a>}</h3>}
          {!this.props.loading && (Meteor.userId() && (this.props.user._id == Meteor.userId() || this.props.user.isAdmin())) &&
            <div>
              <Modal show={this.state.modals.createStatus.show} onHide={()=>this.closeModal('createStatus')}>
                <Modal.Header closeButton>
                  <Modal.Title>New Status</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <CreateStatus
                    cancelCallback={()=>this.closeModal('createStatus')}
                    successCallback={()=>{this.closeModal('createStatus');}}
                  />
                </Modal.Body>
              </Modal>
            </div>
          }

          {!this.props.loading && <ViewStatusList userId={this.props.user._id}/>}
        </div>
      </div>
    );
  }
};

export default withTracker(props => {
  let user = {};
  let loading = true;

  if(!FlowRouter.getParam("userId") && !Meteor.userId()){
    FlowRouter.go('/');
  }

  const handles = [
    Meteor.subscribe('user', FlowRouter.getParam("userId")?FlowRouter.getParam("userId"):Meteor.userId()),
  ];
  loading = handles.some(handle => !handle.ready());
  user = Meteor.users.findOne(FlowRouter.getParam("userId")?FlowRouter.getParam("userId"):Meteor.userId());

  return {
    user,
    loading,
  };
})(StatusFeedTemplate);
