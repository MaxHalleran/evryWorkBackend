import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { ToastContainer, toast } from 'react-toastify';
import * as _ from 'lodash';
import Select from 'react-select';

class EditRoutineTemplate extends Component {
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

  componentDidUpdate = (prevProps, prevState) => {
    if(!this.props.loading && prevProps != this.props){
      if(this.props.routine && this.props.routine.tags){
        this.props.routine.steps = this.props.routine.steps.map(step=>{
          return {...step, product: {value: step.product, label: (step.product && step.product!='')?Products.findOne(step.product).name:'None'}};
        });
      }

      if(this.props.routine && this.props.routine.tags){
        this.props.routine.tags = this.props.routine.tags.map(tag=>{
          return {value: tag, label: Tags.findOne(tag).name, key: tag};
        });
      }
      this.setState({...prevState,routine: this.props.routine});
    }
  }

  submitHandler = (e) => {
    e.preventDefault();
    let routine = _.cloneDeep(this.state.routine);
    delete routine._id;
    this.state.routine.steps.forEach((step, i)=>{
      routine.steps[i].product = step.product.value;
    });
    routine.tags = routine.tags.map(tag=>tag.value);
    Meteor.call('routine.edit', this.state.routine._id, routine, error=>{
      if(error){
        toast.error(error.reason?error.reason:error);
      }else{
        FlowRouter.go(`/routines/${this.state.routine._id}`);
      }
    });
  }


  render(){


    return (
      <div className="routine-view">

        <div className="row">
          <div className="col-sm-4">
            <h3>Edit Routine</h3>
          </div>
          <div className="col-sm-4">
            <a href={`/routines/${this.props.routine._id}`} className="btn btn-secondary">Cancel</a>
          </div>
        </div>

        <form onSubmit={this.submitHandler} className="row">
          <div className="col-sm-2"></div>
          <div className="col-sm-8">
            <div className="form-group">
              <label htmlFor="name">Routine Name</label>
              <input type="text" id="name" value={this.state.routine.name || ''} onChange={(e)=>this.updateRoutineValue(e.target.value, 'name')} className="form-control" />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea id="description" value={this.state.routine.description || ''} onChange={(e)=>this.updateRoutineValue(e.target.value, 'description')} className="form-control" />
            </div>
            <div className="form-group">
              <label htmlFor="buyLink">Buy Link</label>
              <input type="text" id="buyLink" value={this.state.routine.buyLink || ''} onChange={(e)=>this.updateRoutineValue(e.target.value, 'buyLink')} className="form-control" />
            </div>
            <h5>Steps</h5>
            <ul className="repeat-steps">
              {this.state.routine.steps.map((step, i)=>{
                return <li key={i}>
                  <input type="text" value={step.name || ''} onChange={e=>this.updateStep(e.target.value, 'name', i)} className="form-control" />
                  <textarea value={step.description || ''} onChange={e=>this.updateStep(e.target.value, 'description', i)} className="form-control" />
                  {!this.props.loading && this.props.products && <div className="form-group">
                    <Select
                      value={step.product}
                      isMulti={false}
                      onChange={value=>this.updateStep(value, 'product', i)}
                      options={this.props.products.concat([{_id: '', name: 'None'}]).map(product=>{return {value: product._id, label: product.name};})}
                    />
                  </div>}
                  <a href="" onClick={e=>this.addStep(i)}>Add</a>
                  <a href="" onClick={e=>this.removeStep(i)}>Remove</a>
                </li>;
              })}
            </ul>

            <h5>Tags</h5>
            {!this.props.loading && this.props.tags && <div className="form-group">
              <Select
                value={this.state.routine.tags && this.state.routine.tags.map(tag=>{
                  if(typeof tag == 'string'){
                    tag = {value: tag, label: '', key: tag};
                  }
                  return tag;
                })}
                isMulti={true}
                onChange={value=>this.updateRoutineValue(value, 'tags')}
                options={this.props.tags.map(tag=>{return {value: tag._id, label: tag.name};})}
              />
            </div>}

            <input type="submit" className="btn btn-primary" value="Save changes"/>
          </div>
          <div className="col-sm-2"></div>
        </form>

      </div>
    );
  }
};

export default withTracker(props => {
  let user = {},
      routine = {},
      tags = [],
      products = [],
      loading = true;

  if(Meteor.userId()){
    const handles = [
      Meteor.subscribe('tags'),
      Meteor.subscribe('products'),
      Meteor.subscribe('routines'),
      Meteor.subscribe('user'),
    ];
    loading = handles.some(handle => !handle.ready());
    user = Meteor.user();
    tags = Tags.find().fetch();
    products = Products.find().fetch();
    routine = Routines.findOne(FlowRouter.getParam("routineId"));
  }else{
    FlowRouter.go('/');
  }

  return {
    user,
    tags,
    routine,
    loading,
    products,
  };
})(EditRoutineTemplate);
