import React, { Component } from 'react';
import RegisterForm from '/imports/ui/components/forms/auth/Register.jsx';
import LoginForm from '/imports/ui/components/forms/auth/Login.jsx';

export default class LoginRegisterPage extends Component {

  render(){
    return (
      <div className="row">
        <div className="col-sm-2"></div>
        <div className="col-sm-4">
          <LoginForm/>
        </div>
        <div className="col-sm-4">
          <RegisterForm/>
        </div>
        <div className="col-sm-2"></div>
      </div>);
  }
}
