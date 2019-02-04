import React, { Component } from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import FormMessage from './FormMessage';
import { toast } from 'react-toastify';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPassword: false,
      togglePasswordText: 'Show Password',
      password: ''
    };
  }

  updateInputValue = (value, stateKey) => {
    let newState = {};
    newState[stateKey] = value;
    this.setState(newState);
  }

  submitHandler = (e) => {
    e.preventDefault();
    Accounts.resetPassword(FlowRouter.getParam("token"), this.state.password, (error)=>{
      if(error){
        toast.error(error.reason?error.reason:error);
      }else{
        FlowRouter.go('/');
      }
    });
  }


  render(){
    var passwordField = <input type="password" className="form-control" name="password" value={this.state.password} onChange={(e)=>this.updateInputValue(e.target.value, 'password')} placeholder="Password" />;
    if(this.state.showPassword){
      passwordField = <input type="text" className="form-control" name="password" value={this.state.password} onChange={(e)=>this.updateInputValue(e.target.value, 'password')} placeholder="Password" />;
    }
    return  <form onSubmit={this.submitHandler}>
              <h3>Reset Password</h3>
              <label htmlFor="password">Password</label>
              {passwordField}
              <div className="show-password" onClick={this.togglePassword}>{this.state.togglePasswordText}</div>
              <button type="submit" className="btn btn-primary">Submit</button>
            </form>;
  }
};
