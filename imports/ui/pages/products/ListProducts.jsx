import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { ToastContainer, toast } from 'react-toastify';
import * as _ from 'lodash';
import Masonry from '/imports/ui/components/displays/Masonry';
import Loading from '/imports/ui/components/misc/Loading';

class ListProductsTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: {},
      perPage: props.perPage,
      page: 1,
      totalPages: 1,
    };
  }

  static propTypes = {
    user: PropTypes.object,
    products: PropTypes.array,
    tags: PropTypes.array,
    loading: PropTypes.bool,
    perPage: PropTypes.number,
  };

  static defaultProps = {
    loading: true,
    perPage: 8,
  };

  clearFilter = () => {
    FlowRouter.setQueryParams({t: null});
    FlowRouter.setQueryParams({c: null});
    FlowRouter.setQueryParams({b: null});
    FlowRouter.setQueryParams({p: null});
    this.setState({...this.state, page:1, query: {}}, ()=>this.loadProducts());
  }

  clearFilterBy = key => {
    let query = this.state.query;
    switch(key){
      case 'tag':
        FlowRouter.setQueryParams({t: null});
        delete query.tags;
      break;
      case 'brand':
        FlowRouter.setQueryParams({b: null});
        delete query.brand;
      break;
      case 'category':
        FlowRouter.setQueryParams({c: null});
        delete query.categories;
      break;
    }
    FlowRouter.setQueryParams({p: null});
    this.setState({...this.state, page:1, query: query}, ()=>{
      this.loadProducts();
    });
  }

  loadProducts = () => {
    this.setState({loadingProducts: true}, ()=>{
      Meteor.call('products.get', {...this.state.query, highlight: true}, {limit: this.state.perPage, skip: (this.state.page-1)*this.state.perPage}, (error, results)=>{
        this.setState({
          ...this.state,
          loadingProducts: false,
          totalPages: Math.ceil(results.totalProductLength/this.state.perPage),
          products: results.products,
        });
      });
    });

  }

  filterBy = (key, id) => {
    let query = this.state.query;
    switch(key){
      case 'tag':
        FlowRouter.setQueryParams({t: id});
        query.tags = {$elemMatch: {$eq: id}};
      break;
      case 'brand':
        FlowRouter.setQueryParams({b: id});
        query.brand = id;
      break;
      case 'category':
        FlowRouter.setQueryParams({c: id});
        query.categories = {$elemMatch: {$eq: id}};
      break;
    }
    FlowRouter.setQueryParams({p: null});
    this.setState({...this.state, page:1, query: query}, ()=>this.loadProducts());
  }

  goToPage = pageNumber => {
    FlowRouter.setQueryParams({p: pageNumber});
    this.setState({page: pageNumber}, ()=>{
      this.loadProducts();
    });

  }

  componentDidUpdate = (prevProps, prevState) => {
    if(!this.props.loading && prevProps != this.props){
      let query = {highlight: true};
      let page = this.state.page;
      if(FlowRouter.getQueryParam('p')){
        page = FlowRouter.getQueryParam('p');
      }
      if(FlowRouter.getQueryParam('t')){
        query.tags = {$elemMatch: {$eq: FlowRouter.getQueryParam('t')}};
      }
      if(FlowRouter.getQueryParam('b')){
        query.brand = FlowRouter.getQueryParam('b');
      }
      if(FlowRouter.getQueryParam('c')){
        query.categories = {$elemMatch: {$eq: FlowRouter.getQueryParam('c')}};
      }
      this.setState({...this.state, page, query}, ()=>this.loadProducts());
    }
  }

  render(){
    let pageSpread = [];
    if(!this.state.loading){
      for(let p = this.state.page-2; p < this.state.page+2&&p < this.state.totalPages; p++){
        if(p < 0){
          p = 0;
        }
        if(p > this.state.totalPages){
          p = this.state.totalPages;
        }
        pageSpread.push(p);
      }
    }

    return (
      <div>
        <div className="row">
          <div className="col-sm-2">
            {this.props.loading &&
              <ul className="link-list">
                <li><a className="skeleton line"></a></li>
                <li><a className="skeleton line"></a></li>
                <li><a className="skeleton line"></a></li>
              </ul>
            }

            {!this.props.loading &&
              <div>
                <h3>View</h3>
                <ul className="link-list">
                  {this.props.categories.map((category, i)=>{
                    return <li key={i}><a className={(FlowRouter.getQueryParam('c') == category._id)?'active':''} onClick={e=>{this.filterBy('category', category._id)}}>{category.name}</a></li>;
                  })}
                  <li><a onClick={e=>{this.clearFilterBy('category')}}>Show All</a></li>
                </ul>
              </div>
            }
          </div>
          <div className="col-sm-10">
            {this.state.loadingProducts &&
              <Loading />
            }
            {!this.state.loadingProducts && this.state.products &&
              <div>
                {this.state.products && this.state.products.length == 0 &&
                  <h4>No products found</h4>
                }
                <Masonry cutOffText={true} items={this.state.products.map((product, i)=>{
                  return {
                    key: i,
                    title: product.name,
                    text: product.description?product.description.replace(/<(?:.|\n)*?>/gm, ''):'',
                    image: (product.images && product.images[0])?product.images[0]:false,
                    linkUrl: '/products/'+product._id,
                  };
                })}/>

                <div className="pagination">

                  <ul className="page-spread">
                    {this.state.page >= 2 &&
                      <li><a href="" className="arrow" onClick={e=>this.goToPage(this.state.page-1)}>&lt;</a></li>
                    }
                    {this.state.page >= 3 &&
                      <li><a href="" onClick={e=>this.goToPage(1)} >1</a></li>
                    }
                    {this.state.page >= 4 &&
                      <li>...</li>
                    }
                    {pageSpread.map(p=>{
                      return <li key={p}><a onClick={()=>this.goToPage(p+1)} className={(this.state.page-1 == p)?'active':''} href="">{p+1}</a></li>;
                    })}
                    {this.state.page <= this.state.totalPages-4 &&
                      <li>...</li>
                    }
                    {this.state.page <= this.state.totalPages-3 &&
                      <li><a href="" onClick={e=>this.goToPage(this.state.totalPages)} >{this.state.totalPages}</a> </li>
                    }
                    {this.state.page < this.state.totalPages &&
                      <li><a href="" className="arrow" onClick={e=>this.goToPage(this.state.page+1)}>&gt;</a></li>
                    }
                  </ul>

                </div>

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
      products = [],
      tags = [],
      categories = [],
      brands = [],
      loadingProducts = true,
      loading = true;

  const handles = [
    Meteor.subscribe('tags'),
    Meteor.subscribe('categories'),
    Meteor.subscribe('brands'),
    Meteor.subscribe('user'),
  ];
  loading = handles.some(handle => !handle.ready());
  user = Meteor.user();
  tags = Tags.find().fetch();
  categories = Categories.find({showNav: true}).fetch();
  brands = Brands.find().fetch();

  return {
    user,
    products,
    brands,
    categories,
    tags,
    loading,
    loadingProducts,
  };
})(ListProductsTemplate);
