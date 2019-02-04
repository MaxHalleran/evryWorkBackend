import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import * as _ from 'lodash';

export default class Loading extends Component {
  constructor(props) {
    super(props);
  }

  render(){
    return <div className="loading">
      <div className="loader-grid"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
    </div>
  }
}
