import React, { Component } from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import FormMessage from './FormMessage';
import { toast } from 'react-toastify';

export default class RequestPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: ''
    };
  }

  updateInputValue = (value, stateKey) => {
    let newState = {};
    newState[stateKey] = value;
    this.setState(newState);
  }

  submitHandler = (e) => {
    e.preventDefault();
    Accounts.forgotPassword({email: this.state.email}, error=>{
      if(error){
        toast.error(error.reason?error.reason:error);
      }else{
        toast.success('Sent a new password link to your email address');
      }
    });

  }


  render(){
    return  <form onSubmit={this.submitHandler}>
              <h3>Forgot Password?</h3>
              <label htmlFor="email">Email</label>
              <input type="email" name="email" value={this.state.email} onChange={(e)=>this.updateInputValue(e.target.value, 'email')} className="form-control" placeholder="Email" />
              <button type="submit" className="btn btn-primary">Submit</button>
            </form>;
  }
};
