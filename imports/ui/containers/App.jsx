import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import Header from './Header.jsx';
import Footer from './Footer.jsx';


export default class App extends Component {
  render() {
    return (
      <div>
        <ToastContainer />
        <div className="content-area">
          <Header/>
          <div className={`container-fluid main-content ${this.props.className}`}>
            {this.props.content}
          </div>
        </div>
        <Footer/>
      </div>
    );
  }
}
