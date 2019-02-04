import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { ToastContainer, toast } from 'react-toastify';
import * as _ from 'lodash';
import Select from 'react-select';
import AsyncSelect from 'react-select/lib/Async';

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
    successCallback: PropTypes.func,
    errorCallback: PropTypes.func,
    cancelCallback: PropTypes.func,
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
    successCallback: ()=>{
      toast.success('Routine Created!');
    },
    errorCallback: (error)=>{
      if(!error){error={}};
      toast.error(error.reason?error.reason:error);
    },
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
      <form onSubmit={this.submitHandler} className="routine create">
        <div className="form-group">
          <label htmlFor="name">Routine Name</label>
          <input type="text" id="name" onChange={(e)=>this.updateRoutineValue(e.target.value, 'name')} className="form-control" />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea id="description" onChange={(e)=>this.updateRoutineValue(e.target.value, 'description')} className="form-control" />
        </div>
        <h3>Steps</h3>
        <ul className="repeat-steps">
          {this.state.routine.steps.map((step, i)=>{
            return <li key={i}>
              <h4>Step {i+1}</h4>
              <div className="form-group">
                <label htmlFor={`step-${i}-name`}>Title</label>
                <input type="text" id={`step-${i}-name`} value={step.name} onChange={e=>this.updateStep(e.target.value, 'name', i)} className="form-control" />
              </div>
              <div className="form-group">
                <label htmlFor={`step-${i}-description`}>Description</label>
                <textarea value={step.description} id={`step-${i}-description`} onChange={e=>this.updateStep(e.target.value, 'description', i)} className="form-control" />
              </div>
              {!this.props.loading && this.props.products &&
                <div className="form-group">
                  <label>Product Used</label>
                  <AsyncSelect
                    value={this.state.routine.products && this.state.routine.products.map(product=>{
                      if(typeof product == 'string'){
                        product = {value: product, label: '', key: product};
                      }
                      return product;
                    })}
                    isMulti={false}
                    loadOptions={this.getProducts}
                    placeholder="Search for product"
                    noOptionsMessage={()=>"Start typing to search"}
                    onChange={value=>this.updateStep(value, 'product', i)}
                  />

                </div>
              }
              <div className="step-controls">
                <p><a href="" onClick={e=>this.addStep(i)}><span className="glyphicon glyphicon-plus" aria-hidden="true"></span>Add Another Step</a></p>
                <p><a href="" onClick={e=>this.removeStep(i)}><span className="glyphicon glyphicon-remove" aria-hidden="true"></span>Remove This Step</a></p>
              </div>
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

        <input type="submit" className="btn btn-primary" value="Add Routine"/> &nbsp;
        {this.props.cancelCallback && <a href="" className="btn btn-secondary" onClick={this.props.cancelCallback}>Cancel</a>}
      </form>
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
