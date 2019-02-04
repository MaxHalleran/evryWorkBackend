import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { ToastContainer, toast } from 'react-toastify';
import * as _ from 'lodash';
import Select from 'react-select';
import { Modal } from 'react-bootstrap';
import EditRoutine from '/imports/ui/components/forms/routines/EditRoutine';

class ViewRoutineTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      routine: props.routine,
      modals: {
        editRoutine: {
          show: false,
        },
      },
    };
  }

  static propTypes = {
    user: PropTypes.object,
    routine: PropTypes.object,
    tags: PropTypes.array,
    products: PropTypes.array,
    loading: PropTypes.bool,
  };

  static defaultProps = {
    loading: true,
    routine: {},
    products: [],
    tags: [],
    user: {},
  };

  back = () => {
    window.history.back();
  }

  showBack = () => {
    return (FlowRouter.getQueryParam('h') && FlowRouter.getQueryParam('h') == 'rl');
  }

  followRoutine = () => {
    Meteor.call('user.followRoutine', this.props.routine._id, (error, success)=>{
      if(error){
        toast.error(error.reason?error.reason:error);
      }else{
        toast.success('Added to your routines');
      }
    });
  }

  unfollowRoutine = () => {
    Meteor.call('user.unfollowRoutine', this.props.routine._id, (error, success)=>{
      if(error){
        toast.error(error.reason?error.reason:error);
      }else{
        toast.success('Removed from your routines');
      }
    });
  }

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
    console.log(this.props);
    return (
      <div className="routine view">
        <div className="row">
          <div className="col-sm-2"></div>
          <div className="col-sm-3">
            {this.props.loading && <h3 className="skeleton line"></h3>}
            {this.showBack() && <h5><a href="" onClick={this.back}>Back to routines</a></h5>}
            {!this.props.loading && this.props.routine &&
              <h3>{this.props.routine.name}
                {!this.props.loading && this.props.routine.canEdit() &&
                  <div>
                    <span><a href="" onClick={()=>this.openModal('editRoutine')} className="btn btn-primary btn-small">Edit</a></span>
                    <Modal show={this.state.modals.editRoutine.show} onHide={()=>this.closeModal('editRoutine')}>
                      <Modal.Header closeButton>
                        <Modal.Title>Create Routine</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <EditRoutine
                          routine={this.props.routine}
                          cancelCallback={()=>{} }
                          successCallback={()=>{this.closeModal('editRoutine');}}
                        />
                      </Modal.Body>
                    </Modal>
                  </div>
                }
              </h3>
            }

            {!this.props.loading && this.props.routine && !this.props.user.hasRoutine(this.props.routine._id) &&
              <a href="" onClick={this.followRoutine} className="btn btn-primary">Follow Routine</a>
            }
            {!this.props.loading && this.props.routine && this.props.user.hasRoutine(this.props.routine._id) &&
              <a href="" onClick={this.unfollowRoutine} className="btn btn-secondary">Unfollow Routine</a>
            }

            {this.props.loading &&
              <div>
                <p className="skeleton line"></p>
                <p className="skeleton line"></p>
                <p className="skeleton line"></p>
              </div>
            }
            <div className="spacer v20"></div>
            {!this.props.loading && this.props.routine && this.props.routine.description &&
              <div className="description">
                <p>{this.props.routine.description}</p>
              </div>
            }

            {!this.props.loading && this.props.routine && this.props.routine.tags &&
              <div>
                <ul className="tags tag-list">
                  {this.props.routine.tags.map(tag=>{
                    let tagDoc = Tags.findOne(tag.value?tag.value:tag);
                    console.log('tagDoc', tagDoc);
                    return <li key={tag}>{tagDoc?tagDoc.name:''}</li>
                  })}
                </ul>
              </div>
            }

          </div>
          <div className="col-sm-5">

            {!this.props.loading && this.props.routine && this.props.routine.steps &&
              <ul className="steps">
                {this.props.routine.steps.map((step, i)=>{
                  let product;
                  if(step.product){
                    product = Products.findOne(step.product);
                  }
                  return <li key={i} className="step">
                    <h3 className="title">Step {i+1}: {step.name}</h3>
                    {product && product.images && product.images[0] &&
                      <a href={product.buyLink?product.buyLink:`/products/${product._id}`} target="_blank">
                        <img src={product.images[0].url} />
                      </a>
                    }
                    {step.description &&
                      <p className="description">{step.description}</p>
                    }
                  </li>;
                })}
              </ul>
            }
          </div>
        </div>
      </div>
    );
  }
};

export default withTracker(props => {
  let user = {},
      routine = {},
      tags = [],
      loading = true;

  const handles = [
    Meteor.subscribe('routines'),
    Meteor.subscribe('tags'),
    Meteor.subscribe('products'),
    Meteor.subscribe('user'),
  ];
  loading = handles.some(handle => !handle.ready());
  user = Meteor.user();
  tags = Tags.find().fetch();
  products = Products.find().fetch();
  routine = Routines.findOne(FlowRouter.getParam("routineId"));

  return {
    user,
    routine,
    products,
    tags,
    loading,
  };
})(ViewRoutineTemplate);
