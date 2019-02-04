import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { ToastContainer, toast } from 'react-toastify';

class AdminBrandsTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  static propTypes = {
    user: PropTypes.object,
    brands: PropTypes.array,
    loading: PropTypes.bool,
  };

  static defaultProps = {
    loading: true,
  };

  deleteItem = id => {
    Meteor.call('brand.delete', id, error=>{
      if(error){
        toast.error(error.reason?error.reason:error);
      }else{
        toast.success('Brand removed');
      }
    })
  };

  render(){
    if(!this.props.loading && !this.props.user.isAdmin()){
      FlowRouter.go('/');
    }
    return (
      <div>
        <div className="row">
          <div className="col-sm-4">
            <h3>Brands</h3>
          </div>
          <div className="col-sm-4">
            <a href="/admin/brands/new" className="btn btn-primary">Add Brand</a>
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <td>Brand Name</td>
              <td>Actions</td>
              <td>Status</td>
            </tr>
          </thead>
          {this.props.loading && <tbody>
            <tr>
              <td><p className="skeleton line"></p></td>
              <td><p className="skeleton line"></p></td>
              <td><p className="skeleton line"></p></td>
            </tr>
            <tr>
              <td><p className="skeleton line"></p></td>
              <td><p className="skeleton line"></p></td>
              <td><p className="skeleton line"></p></td>
            </tr>
            <tr>
              <td><p className="skeleton line"></p></td>
              <td><p className="skeleton line"></p></td>
              <td><p className="skeleton line"></p></td>
            </tr>
            <tr>
              <td><p className="skeleton line"></p></td>
              <td><p className="skeleton line"></p></td>
              <td><p className="skeleton line"></p></td>
            </tr>
          </tbody>}
          {!this.props.loading && <tbody>
            {this.props.brands.map(brand=>{
              return (<tr key={brand._id}>
                <td><a href={"/admin/brands/"+brand._id}>{brand.name}</a></td>
                <td><a href="" onClick={e=>{this.deleteItem(brand._id)}}>Delete</a></td>
                <td>{brand.status}</td>
              </tr>);
            })}
          </tbody>}
        </table>
      </div>
    );
  }
};

export default withTracker(props => {
  let user = {},
      brands = [],
      loading = true;

  if(Meteor.userId()){
    const handles = [
      Meteor.subscribe('brands'),
      Meteor.subscribe('user'),
    ];
    loading = handles.some(handle => !handle.ready());
    user = Meteor.user();
    brands = Brands.find().fetch();
  }else{
    FlowRouter.go('/');
  }

  return {
    user,
    brands,
    loading,
  };
})(AdminBrandsTemplate);
