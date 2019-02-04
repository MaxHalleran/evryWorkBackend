import React, { Component } from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import FormMessage from './FormMessage';
import Recaptcha from 'react-recaptcha';
import { toast } from 'react-toastify';

export default class RegisterForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPassword: false,
      togglePasswordText: 'Show Password',
      recaptchaVerified: false,
      formMessage: {
        header: '',
        className: '',
        content: '',
      },
      email: '',
      password: '',
    };
  }

  updateInputValue = (value, stateKey) => {
    let newState = {};
    newState[stateKey] = value;
    this.setState(newState);
  }

  submitHandler = (e) => {
    e.preventDefault();
    if(this.state.recaptchaVerified){
      Meteor.call('user.create', {email: this.state.email, password: this.state.password}, (error, result)=>{
        if(error){

          /*this.setState({formMessage: {
            header: result.message.header,
            content: result.message.content,
            className: 'error',
          }});*/
          toast.error(error.reason?error.reason:error);
        }else{
          toast.success("Account created");
          Meteor.loginWithPassword(this.state.email, this.state.password, function(){
            FlowRouter.go('/');
          });
        }
      });
    }else{
      toast.error("Please complete the recaptcha");
    }

  }

  togglePassword = (e) => {
    e.preventDefault();
    if(this.state.showPassword){
      this.setState({showPassword: false});
      this.setState({togglePasswordText: 'Show Password'});
    }else{
      this.setState({showPassword: true});
      this.setState({togglePasswordText: 'Hide Password'});
    }
  }

  verifyRecaptcha = (e) => {
    this.setState({recaptchaVerified: true});
  }

  expiredRecaptcha = () => {
    this.setState({recaptchaVerified: false});
  }

  render(){
    const recaptchaKey = Meteor.settings.public.apiKeys.recaptcha;
    var passwordField = <input type="password" className="form-control" name="password" value={this.state.password} onChange={(e)=>this.updateInputValue(e.target.value, 'password')} placeholder="Password" />;
    if(this.state.showPassword){
      passwordField = <input type="text" className="form-control" name="password" value={this.state.password} onChange={(e)=>this.updateInputValue(e.target.value, 'password')} placeholder="Password" />;
    }
    return  <form id="signup" onSubmit={this.submitHandler}>
              <label htmlFor="email">Email</label>
              <input type="email" name="email" className="form-control" value={this.state.email} onChange={(e)=>this.updateInputValue(e.target.value, 'email')} placeholder="Email" />
              <label htmlFor="password">Password</label>
              {passwordField}
              <div className="show-password" onClick={this.togglePassword}>{this.state.togglePasswordText}</div>

              <Recaptcha sitekey={recaptchaKey} verifyCallback={this.verifyRecaptcha} expiredCallback={this.expiredRecaptcha}/>

              <button type="submit" className="btn btn-primary">Signup</button>
              <FormMessage header={this.state.formMessage.header} className={this.state.formMessage.className} content={this.state.formMessage.content}/>
            </form>;
  }
};
