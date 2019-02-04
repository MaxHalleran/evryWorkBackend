import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { ToastContainer, toast } from 'react-toastify';
import * as _ from 'lodash';
import Select from 'react-select';
import { Markup } from 'interweave';

class ViewProductTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product: props.product,
    };
  }

  static propTypes = {
    user: PropTypes.object,
    product: PropTypes.object,
    loading: PropTypes.bool,
  };

  static defaultProps = {
    loading: true,
    product: {},
    user: {},
  };

  back = () => {
    window.history.back();
  }


  render(){

    /*

                <h3>Categories</h3>
                {this.props.loading &&
                  <ul className="tags tag-list">
                    <li className="skeleton line"></li>
                    <li className="skeleton line"></li>
                  </ul>
                }
                {!this.props.loading && this.props.product && this.props.product.categories &&
                  <ul className="categories categories-list">
                    {this.props.product.categories.map((category, i)=>{
                      return <li key={i}>{Categories.findOne(category).name}</li>
                    })}
                  </ul>
                }

                <h3>Tags</h3>
                {this.props.loading &&
                  <ul className="tags tag-list">
                    <li className="skeleton line"></li>
                    <li className="skeleton line"></li>
                    <li className="skeleton line"></li>
                  </ul>
                }
                {!this.props.loading && this.props.product && this.props.product.tags &&
                  <ul className="tags tag-list">
                    {this.props.product.tags.map((tag, i)=>{
                      return <li key={i}>{Tags.findOne(tag).name}</li>
                    })}
                  </ul>
                }
    */

    return (
      <div className="product-view">
        <div className="row">
          <div className="col-sm-4">
            {this.props.loading && <h3 className="skeleton line"></h3>}
            <h5><a href="" onClick={this.back}>Back to spaces</a></h5>

            {!this.props.loading && this.props.product && this.props.product.images &&
              <ul className="image-gallery">
               {this.props.product.images.map((image, i)=>{
                 return <li key={i}>
                  <img src={image.url} />
                 </li>;
               })}
              </ul>
            }
          </div>
          <div className="col-sm-8">
            {this.props.loading &&
              <div>
                <p className="skeleton line"></p>
                <p className="skeleton line"></p>
                <p className="skeleton line"></p>
              </div>
            }

            {!this.props.loading && this.props.product &&
              <h3 className="product-title">{this.props.product.name} {this.props.product.brand && <span className="product-brand"> - by {this.props.product.brand}</span>}
                {!this.props.loading && this.props.product && this.props.product.buyLink &&
                  <a href={this.props.product.buyLink} className="btn btn-primary buy-link">Buy</a>
                }
              </h3>
            }

            {!this.props.loading && this.props.product && this.props.product.description &&
              <div className="description">
                <Markup content={this.props.product.description} />
              </div>
            }

            {!this.props.loading && this.props.product && this.props.product.ingredients &&
              <div className="ingredients">
                <h4>Ingredients</h4>
                <p>{this.props.product.ingredients}</p>
              </div>
            }


            {!this.props.loading && this.props.product && this.props.product.categories &&
              <div>
                <h4>Features</h4>
                <ul className="features features-list">
                  {this.props.product.features.map((feature, i)=>{
                    return <li key={i}>{feature}</li>
                  })}
                </ul>
              </div>
            }

          </div>
        </div>
      </div>
    );
  }
};

export default withTracker(props => {
  let user = {},
      product = {},
      tags = [],
      categories = [],
      brands = [],
      loading = true;

  const handles = [
    Meteor.subscribe('products'),
    Meteor.subscribe('tags'),
    Meteor.subscribe('categories'),
    Meteor.subscribe('brands'),
    Meteor.subscribe('user'),
  ];
  loading = handles.some(handle => !handle.ready());
  user = Meteor.user();
  tags = Tags.find().fetch();
  product = Products.findOne(FlowRouter.getParam("productId"));

  return {
    user,
    product,
    categories,
    brands,
    tags,
    loading,
  };
})(ViewProductTemplate);
