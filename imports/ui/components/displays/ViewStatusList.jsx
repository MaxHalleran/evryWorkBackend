import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { ToastContainer, toast } from 'react-toastify';
import * as _ from 'lodash';
import { Modal } from 'react-bootstrap';
import EditStatus from '/imports/ui/components/forms/status/EditStatus';

class StatusListTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statuses: [],
      modals: {

      },
    };
  }

  static propTypes = {
    loading: PropTypes.bool,
    query: PropTypes.object,
    queryOptions: PropTypes.object,
  };

  static defaultProps = {
    loading: true,
    query: {},
    queryOptions: {
      sort: {
        createdAt: -1,
      },
    },
  };

  deleteStatus = statusId => {
    Meteor.call('status.delete', statusId, error=>{
      if(error){
        toast.error(error.reason?error.reason:error);
      }else{
        toast.success('Status removed');
      }
    });
  };

  componentDidUpdate = (prevProps, prevState) => {
    if(!this.props.loading && prevProps != this.props){
      let statuses = Statuses.find(this.props.query, this.props.queryOptions).fetch();
      let modals = {};
      for(let s = 0; s<statuses.length; s++){
        modals[statuses[s]._id] = {show: false};
      }
      this.setState({...prevState, statuses, modals});
    }
  };

  closeModal = statusId => {
    let modals = _.cloneDeep(this.state.modals);
    modals[statusId].show = false;
    this.setState({modals});
  }

  openModal = statusId => {
    let modals = _.cloneDeep(this.state.modals);
    modals[statusId].show = true;
    this.setState({modals});
  }

  render(){
    //<Modal show={this.state.modals[status._id].show} onHide={()=>this.closeModal(status._id)}>
    return (
      <div>
        {this.props.loading &&
          <ul className="status list">
            <li><p className="skeleton line"></p></li>
            <li><p className="skeleton line"></p></li>
            <li><p className="skeleton line"></p></li>
          </ul>
        }

        {!this.props.loading && (!this.state.statuses || this.state.statuses.length == 0) &&
          <h4>No status updates yet</h4>
        }

        {!this.props.loading && this.state.statuses && this.state.statuses.length >= 1 &&
          <ul className="status list">
            {this.state.statuses.map(status=>{
              return <li className="status item" key={status._id}>
                <Modal show={this.state.modals[status._id].show} onHide={()=>this.closeModal(status._id)}>
                  <Modal.Header closeButton>
                    <Modal.Title>Edit Status</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <EditStatus
                      cancelCallback={()=>this.closeModal(status._id)}
                      successCallback={()=>{this.closeModal(status._id);toast.success('Status Updated');}}
                      status={status}
                    />
                  </Modal.Body>
                </Modal>
                {status.image && !status.description && !status.name &&
                  <div>
                    <img src={status.imageUploading?'/img/loading.jpg':status.image} />
                    {this.props.user && (this.props.user.isAdmin() || this.props.user._id == status.userId) &&
                      <div className="status-controls">
                        <a href="" onClick={e=>{this.deleteStatus(status._id)}}><span className="glyphicon glyphicon-trash" aria-hidden="true"></span></a>
                        <a href="" onClick={e=>{this.openModal(status._id)}}><span className="glyphicon glyphicon-edit" aria-hidden="true"></span></a>
                      </div>
                    }
                  </div>
                }
                {status.image && (status.description || status.name) &&
                  <div className="row">
                    <div className="col-sm-4">
                      <img src={status.imageUploading?'/img/loading.jpg':status.image} />
                    </div>
                    <div className="col-sm-8">
                      {status.name && <h5>{status.name}</h5>}
                      {status.description && <p>{status.description}</p>}
                      {this.props.user && (this.props.user.isAdmin() || this.props.user._id == status.userId) &&
                        <div className="status-controls">
                          <a href="" onClick={e=>{this.deleteStatus(status._id)}}><span className="glyphicon glyphicon-trash" aria-hidden="true"></span></a>
                          <a href="" onClick={e=>{this.openModal(status._id)}}><span className="glyphicon glyphicon-edit" aria-hidden="true"></span></a>
                        </div>
                      }
                    </div>
                  </div>
                }
                {!status.image &&
                  <div>
                    {status.name && <h5>{status.name}</h5>}
                    {status.description && <p>{status.description}</p>}
                    {this.props.user && (this.props.user.isAdmin() || this.props.user._id == status.userId) &&
                      <div className="status-controls">
                        <a href="" onClick={e=>{this.deleteStatus(status._id)}}><span className="glyphicon glyphicon-trash" aria-hidden="true"></span></a>
                        <a href="" onClick={e=>{this.openModal(status._id)}}><span className="glyphicon glyphicon-edit" aria-hidden="true"></span></a>
                      </div>
                    }
                  </div>
                }



              </li>;
            })}
          </ul>
        }
      </div>
    );
  }
};

export default withTracker(props => {
  let loading = true,
      user,
      statuses;
  const handles = [
    Meteor.subscribe('user.publicProfile'),
    Meteor.subscribe('statuses.byUser', props.userId?props.userId:false),
  ];

  loading = handles.some(handle => !handle.ready());
  statuses = Statuses.find().fetch();
  if(Meteor.userId()){
    user = Meteor.users.findOne(Meteor.userId());
  }

  return {
    user,
    loading,
    statuses,
  };
})(StatusListTemplate);
