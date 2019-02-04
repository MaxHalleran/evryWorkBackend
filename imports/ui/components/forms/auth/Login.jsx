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
      formMessage: {
        header: '',
        className: '',
        content: '',
      },
      email: '',
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
    Meteor.loginWithPassword(this.state.email, this.state.password, (error)=>{
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
              <label htmlFor="email">Email</label>
              <input type="email" name="email" value={this.state.email} onChange={(e)=>this.updateInputValue(e.target.value, 'email')} className="form-control" placeholder="Email" />
              <label htmlFor="password">Password</label>
              {passwordField}
              <div className="show-password" onClick={this.togglePassword}>{this.state.togglePasswordText}</div>
              <button type="submit" className="btn btn-primary">Log in</button>
            </form>;
  }
};
