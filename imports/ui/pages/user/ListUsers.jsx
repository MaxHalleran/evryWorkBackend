import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { ToastContainer, toast } from 'react-toastify';
import * as _ from 'lodash';
import Masonry from '/imports/ui/components/displays/Masonry';
import Loading from '/imports/ui/components/misc/Loading';

class ListUsersTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: {},
      perPage: props.perPage,
      page: 1,
      totalPages: 1,
    };
  }

  componentDidUpdate = (prevProps, prevState) => {
    if(!this.props.loading && prevProps != this.props){
      this.setState({...this.state, users: this.props.users});
    }
  }


  render(){

    return (
      <div>
        <div className="row">
          <div className="col-sm-12">
            <h3>Here are just some of our amazing users</h3>
            {this.state.loading &&
              <Loading />
            }
            {!this.state.loading && this.state.users &&
              <div>
                {this.state.users && this.state.users.length == 0 &&
                  <h4>No users found</h4>
                }
                <Masonry cutOffText={true} items={this.state.users.map((user, i)=>{
                  return {
                    key: i,
                    title: `${user.getFirstName()} ${user.getLastName()}`,
                    image: {url: user.getStatusImage()},
                    linkUrl: '/profile/'+user._id,
                  };
                })}/>

              </div>
            }
          </div>
        </div>

      </div>
    );
  }
};

export default withTracker(props => {
  let users = [],
      loading = true,
      statuses = [];

  const handles = [
    Meteor.subscribe('users', {options: {limit: 10}}),
    Meteor.subscribe('statuses.byUsers', {options: {limit: 10}}),
  ];
  loading = handles.some(handle => !handle.ready());
  users = Meteor.users.find().fetch();
  statuses = Statuses.find().fetch();

  return {
    users,
    statuses,
    loading,
  };
})(ListUsersTemplate);
