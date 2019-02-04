import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { ToastContainer, toast } from 'react-toastify';

class AdminCategoriesTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  static propTypes = {
    user: PropTypes.object,
    categories: PropTypes.array,
    loading: PropTypes.bool,
  };

  static defaultProps = {
    loading: true,
  };

  deleteItem = id => {
    Meteor.call('category.delete', id, error=>{
      if(error){
        toast.error(error.reason?error.reason:error);
      }else{
        toast.success('Category removed');
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
          <div className="col-sm-12">
            <h3>Categories &nbsp; <a href="/admin/categories/new" className="btn btn-primary">Add Category</a></h3>
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <td>Category Name</td>
              <td>Actions</td>
            </tr>
          </thead>
          {this.props.loading && <tbody>
            <tr>
              <td><p className="skeleton line"></p></td>
              <td><p className="skeleton line"></p></td>
            </tr>
            <tr>
              <td><p className="skeleton line"></p></td>
              <td><p className="skeleton line"></p></td>
            </tr>
            <tr>
              <td><p className="skeleton line"></p></td>
              <td><p className="skeleton line"></p></td>
            </tr>
            <tr>
              <td><p className="skeleton line"></p></td>
              <td><p className="skeleton line"></p></td>
            </tr>
          </tbody>}
          {!this.props.loading && <tbody>
            {this.props.categories.map(category=>{
              return (<tr key={category._id}>
                <td><a href={"/admin/categories/"+category._id}>{category.name}</a></td>
                <td><a href="" onClick={e=>{this.deleteItem(category._id)}}>Delete</a></td>
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
      categories = [],
      loading = true;

  if(Meteor.userId()){
    const handles = [
      Meteor.subscribe('categories'),
      Meteor.subscribe('user'),
    ];
    loading = handles.some(handle => !handle.ready());
    user = Meteor.user();
    categories = Categories.find().fetch();
  }else{
    FlowRouter.go('/');
  }

  return {
    user,
    categories,
    loading,
  };
})(AdminCategoriesTemplate);
