import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import Select from 'react-select';

const NewSelect = React.cloneElement(Select,
  {
    onKeyUp: e=>{
      console.log('Select Keyed up')
    }
  }
);

export default NewSelect;
