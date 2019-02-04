import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { ToastContainer, toast } from 'react-toastify';
import * as _ from 'lodash';
import { Modal } from 'react-bootstrap';
import RoutineForm from '/imports/ui/components/forms/routines/CreateRoutine';
import Masonry from '/imports/ui/components/displays/Masonry';

class ListRoutinesTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modals: {
        createRoutine: {
          show: false,
        },
      },
    };
  }

  static propTypes = {
    user: PropTypes.object,
    routines: PropTypes.array,
    tags: PropTypes.array,
    loading: PropTypes.bool,
  };

  static defaultProps = {
    loading: true,
  };

  clearFilter = () => {
    FlowRouter.setQueryParams({t: null});
    this.setState({...this.state, routines: Routines.find().fetch()});
  }

  filterByTag = tagId => {
    FlowRouter.setQueryParams({t: tagId});
    this.setState({...this.state, routines: Routines.find({tags: {$elemMatch: {$eq: tagId}}}).fetch()});
  }

  componentDidUpdate = (prevProps, prevState) => {
    if(!this.props.loading && prevProps != this.props){
      this.setState({...prevState,routines: this.props.routines});
    }
    if(prevProps.loading && !this.props.loading && FlowRouter.getQueryParam('t')){
      this.setState({...this.state, routines: Routines.find({tags: {$elemMatch: {$eq: FlowRouter.getQueryParam('t')}}}).fetch()});
    }
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
    return (
      <div>
        <div className="row">
          <div className="col-sm-3">
            <h3>Filter Spaces By</h3>
            {this.props.loading &&
              <ul className="link-list">
                <li><a className="skeleton line"></a></li>
                <li><a className="skeleton line"></a></li>
                <li><a className="skeleton line"></a></li>
              </ul>
            }

            {!this.props.loading &&
              <ul className="link-list">
                {this.props.tags.map(tag=>{
                  return <li key={tag._id}><a onClick={e=>{this.filterByTag(tag._id)}}>{tag.name}</a></li>;
                })}
                <li><a onClick={this.clearFilter}>Show All</a></li>
              </ul>
            }

            {Meteor.userId() &&
              <div>
                <a href="" onClick={()=>this.openModal('createRoutine')}>Schedule a New Booking</a>
                <Modal show={this.state.modals.createRoutine.show} onHide={()=>this.closeModal('createRoutine')}>
                  <Modal.Header closeButton>
                    <Modal.Title>Schedule a new booking</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <RoutineForm
                      cancelCallback={()=>{this.closeModal('createRoutine');} }
                      successCallback={()=>{
                        this.closeModal('createRoutine');
                        toast.success('Routine Created');
                        FlowRouter.go(`/routines/${routineId}`);
                      }}
                    />
                  </Modal.Body>
                </Modal>
              </div>
            }
          </div>
          <div className="col-sm-9">
            {!this.props.loading && this.state.routines &&
              <div>
                {this.state.routines && this.state.routines.length == 0 &&
                  <h4>Nothing currently scheduled</h4>
                }
                <Masonry items={this.state.routines.map(routine=>{
                  return {
                    title: routine.name,
                    text: routine.description,
                    linkUrl: `/routines/${routine._id}/?h=rl`,
                  };
                })}/>
              </div>
            }
          </div>
        </div>

      </div>
    );
  }
};

export default withTracker(props => {
  let user = {},
      routines = [],
      tags = [],
      loading = true;

  const handles = [
    Meteor.subscribe('routines'),
    Meteor.subscribe('tags'),
    Meteor.subscribe('user'),
  ];
  loading = handles.some(handle => !handle.ready());
  user = Meteor.user();
  routines = Routines.find().fetch();
  tags = Tags.find().fetch();

  return {
    user,
    routines,
    tags,
    loading,
  };
})(ListRoutinesTemplate);
