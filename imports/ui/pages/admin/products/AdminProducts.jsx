import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { ToastContainer, toast } from 'react-toastify';
import { CSVLink, CSVDownload } from "react-csv";

class AdminProductsTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exportData: []
    };
  }

  static propTypes = {
    user: PropTypes.object,
    products: PropTypes.array,
    loading: PropTypes.bool,
  };

  static defaultProps = {
    loading: true,
  };

  deleteItem = id => {
    Meteor.call('product.delete', id, error=>{
      if(error){
        toast.error(error.reason?error.reason:error);
      }else{
        toast.success('Product removed');
      }
    })
  };

  exportProducts = () => {
    Meteor.call('products.export', (error, productData)=>{
      if(error){
        toast.error(error.reason?error.reason:error);
      }else{
        this.setState({exportData: productData}, () => {
          this.csvLink.link.click();
        });
      }
    });
  }

  importProducts = (fileUpload) => {
    var reader = new FileReader();
    reader.onload = (e) => {
      Meteor.call('products.import', e.target.result, error=>{
        this.importField.value = '';
        if(error){
          toast.error(error.reason?error.reason:error);
        }else{
          toast.success('CSV Processed');
        }
      });

    }
    reader.readAsText(fileUpload);
  }

  render(){
    if(!this.props.loading && !this.props.user.isAdmin()){
      FlowRouter.go('/');
    }
    return (
      <div>
        <div className="row">
          <div className="col-sm-12">
            <h3>Products
               &nbsp; <a href="/admin/products/new" className="btn btn-primary">Add Product</a>
               &nbsp; <a href="" onClick={this.exportProducts} className="btn btn-primary">Export All</a>
               &nbsp; <label htmlFor="importField" className="btn btn-primary">Import CSV</label>
              <input type="file" id="importField" ref={r=>this.importField=r} className="hidden" onChange={e=>{this.importProducts(e.target.files[0])}}/>
            </h3>
            <CSVLink
              data={this.state.exportData}
              filename="EpiiqProductExport.csv"
              className="hidden"
              ref={(r) => this.csvLink = r}
              target="_blank"
            />
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <td>Product Name</td>
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
            {this.props.products.map(product=>{
              return (<tr key={product._id}>
                <td><a href={"/admin/products/"+product._id}>{product.name}</a></td>
                <td><a href="" onClick={e=>{this.deleteItem(product._id)}}>Delete</a></td>
                <td>{product.status}</td>
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
      products = [],
      loading = true;

  if(Meteor.userId()){
    const handles = [
      Meteor.subscribe('products'),
      Meteor.subscribe('user'),
    ];
    loading = handles.some(handle => !handle.ready());
    user = Meteor.user();
    products = Products.find().fetch();
  }else{
    FlowRouter.go('/');
  }

  return {
    user,
    products,
    loading,
  };
})(AdminProductsTemplate);
