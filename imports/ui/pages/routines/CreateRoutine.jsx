import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { ToastContainer, toast } from 'react-toastify';
import * as _ from 'lodash';
import { Modal } from 'react-bootstrap';
import RoutineForm from '/imports/ui/components/forms/routines/CreateRoutine';

class CreateRoutineTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      routine: props.routine,
    };
  }

  static propTypes = {
    user: PropTypes.object,
    routine: PropTypes.object,
    products: PropTypes.array,
    tags: PropTypes.array,
    loading: PropTypes.bool,
  };

  static defaultProps = {
    loading: true,
    routine: {
      steps:[
        {
          name: '',
          description: '',
          product: '',
        },
      ],
    },
    products: [],
    tags: [],
    user: {},
  };

  updateRoutineValue = (value, stateKey) => {
    let newState = this.state.routine?this.state.routine:{};
    newState[stateKey] = value;
    this.setState({routine: newState});
  }

  updateStep = (value, field, index) => {
    let newState = _.cloneDeep(this.state.routine?this.state.routine:{steps:[]});
    newState.steps[index][field] = value;
    this.setState({routine: newState});
  }

  addStep = index => {
    let newState = _.cloneDeep(this.state.routine?this.state.routine:{steps:[]});
    newState.steps.splice(index+1, 0, {name: '', description: '', product: ''});
    this.setState({routine: newState});
  }

  removeStep = index => {
    let newState = _.cloneDeep(this.state.routine?this.state.routine:{steps:[]});
    if(newState.steps.length > 1){
      newState.steps.splice(index, 1);
      this.setState({routine: newState});
    }
  }

  updateTags = (value, stateKey) => {
    let newState = this.state.product?this.state.product:{};
    newState[stateKey] = value;
    this.setState({product: newState});
  }

  /*componentDidUpdate = (prevProps, prevState) => {
    if(!this.props.loading && prevProps != this.props){
      if(this.props.tags){
        this.props.tags = this.props.tags.map(tag=>{
          return {value: tag, label: Tags.findOne(tag).name, key: tag};
        });
      }
    }
  }*/

  getProducts = (input, callback) => {
    if (input.length > 0) {
        var searchString = input.toLowerCase().trim();
        return new Promise(resolve => {
          Meteor.call('products.search', input, (error, products)=>{
            products.push({_id: '', name: 'None'})
            resolve( products.map(product=>{
              let p = {value: product._id, label: product.name};
              if(product.brand){
                p.label+= ` - ${product.brand}`;
              }
              return p;
            }));
          });
        });
    } else {
      return new Promise(resolve => {
        resolve([{_id: '', name: 'None'}]);
      });
    }
  };

  submitHandler = (e) => {
    e.preventDefault();
    let routine = _.cloneDeep(this.state.routine);
    this.state.routine.steps.forEach((step, i)=>{
      routine.steps[i].product = step.product.value;
    });
    routine.tags = routine.tags.map(tag=>tag.value);
    Meteor.call('routine.create', routine, (error, routineId)=>{
      if(error){
        toast.error(error.reason?error.reason:error);
      }else{
        FlowRouter.go(`/routines/${routineId}`);
      }
    });

  }


  render(){
    return (
      <div className="routine-view">

        <div className="row">
          <div className="col-sm-2"></div>
          <div className="col-sm-8">
            <RoutineForm
              successCallback={()=>{
                toast.success('Routine Created');
                FlowRouter.go(`/routines/${routineId}`);
              }}
            />
          </div>
          <div className="col-sm-2"></div>

        </div>

        <div className="spacer v50"></div>
      </div>
    );
  }
};

export default withTracker(props => {
  let user = {},
      tags = [],
      products = [],
      loading = true;

  if(Meteor.userId()){
    const handles = [
      Meteor.subscribe('tags'),
      Meteor.subscribe('products'),
      Meteor.subscribe('user'),
    ];
    loading = handles.some(handle => !handle.ready());
    user = Meteor.user();
    tags = Tags.find().fetch();
    //products = Products.find().fetch();
  }else{
    FlowRouter.go('/');
  }

  return {
    user,
    tags,
    loading,
    products,
  };
})(CreateRoutineTemplate);
