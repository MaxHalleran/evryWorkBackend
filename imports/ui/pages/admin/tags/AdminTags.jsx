import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { ToastContainer, toast } from 'react-toastify';

class AdminTagsTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  static propTypes = {
    user: PropTypes.object,
    tags: PropTypes.array,
    loading: PropTypes.bool,
  };

  static defaultProps = {
    loading: true,
  };

  deleteItem = id => {
    Meteor.call('tag.delete', id, error=>{
      if(error){
        toast.error(error.reason?error.reason:error);
      }else{
        toast.success('Tag removed');
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
            <h3>Tags &nbsp; <a href="/admin/tags/new" className="btn btn-primary">Add Tag</a></h3>
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <td>Tag Name</td>
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
            {this.props.tags.map(tag=>{
              return (<tr key={tag._id}>
                <td><a href={"/admin/tags/"+tag._id}>{tag.name}</a></td>
                <td><a href="" onClick={e=>{this.deleteItem(tag._id)}}>Delete</a></td>
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
      tags = [],
      loading = true;

  if(Meteor.userId()){
    const handles = [
      Meteor.subscribe('tags'),
      Meteor.subscribe('user'),
    ];
    loading = handles.some(handle => !handle.ready());
    user = Meteor.user();
    tags = Tags.find().fetch();
  }else{
    FlowRouter.go('/');
  }

  return {
    user,
    tags,
    loading,
  };
})(AdminTagsTemplate);
