import React, { Component } from 'react';

export default class Footer extends Component {
  render() {
    return (
      <footer className="container-fluid">
          &copy; {new Date().getFullYear()} Epiiq
      </footer>
    );
  }
}
