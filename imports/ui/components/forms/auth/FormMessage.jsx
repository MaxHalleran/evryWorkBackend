import React, { Component } from 'react';
import PropTypes from 'prop-types';


export default class RegisterPage extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    header: PropTypes.string,
    className: PropTypes.string,
    content: PropTypes.string,
  }


  render(){

      return (
        <div className={`formMessage ${this.props.className}`}>
          <div className='formMessage-header'>{this.props.header}</div>
          <div className='formMessage-content'>{this.props.content}</div>
        </div>
      );

  }
}
