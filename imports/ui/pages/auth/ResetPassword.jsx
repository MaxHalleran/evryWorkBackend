import React, { Component } from 'react';

import ResetPasswordForm from '/imports/ui/components/forms/auth/ResetPassword.jsx';
export default class LoginPage extends Component {

  render(){
    return <span>
      <ResetPasswordForm/>
      <hr/>
    </span>;
  }
}
