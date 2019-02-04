import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { ToastContainer, toast } from 'react-toastify';
import Select from 'react-select';
import * as _ from 'lodash';
import Checkbox from '/imports/ui/components/forms/components/Checkbox.jsx';

class EditStatusTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: {
        public: true,
      },
    };
  }

  static propTypes = {
    status: PropTypes.object,
    privacySettings: PropTypes.array,
    statusId: PropTypes.string,
    settings: PropTypes.object,
    successCallback: PropTypes.func,
    errorCallback: PropTypes.func,
    cancelCallback: PropTypes.func,
  };

  static defaultProps = {
    settings: {
      showImage: true,
      showTitle: true,
      showDescription: true,
      cancelCallback: false,
      showPrivacy: true,
    },
    privacySettings: [
      {value: false, label: 'Private'},
      {value: true, label: 'Public'},
    ],
    successCallback: ()=>{
      toast.success('Status Posted!');
    },
    errorCallback: (error)=>{
      if(!error){error={}};
      toast.error(error.reason?error.reason:error);
    },
  };

  updateStatusValue = (value, stateKey) => {
    let newState = this.state.status?this.state.status:{};
    newState[stateKey] = value;
    this.setState({status: newState});
  }

  selectedImage = event => {
    this.setState({image: event.target.files}, ()=>{
      if (FileReader && this.state.image && this.state.image.length) {
          var fr = new FileReader();
          fr.onload = () => {
            this.setState({tempImage: fr.result});
          }
          fr.readAsDataURL(this.state.image[0]);
      }
    });

  }

  uploadImage = (files, imageType, var1, var2) => {
    return new Promise((resolve, reject)=>{
      if(files){
        const file = files[0];
        let uploadSettings = {
          file:  file,
          streams: 'dynamic',
          chunkSize: 'dynamic',
        };

        switch(imageType){
          case 'productPhoto':
            uploadSettings.meta = {
              directions: {
                type: imageType,
                productId: var1,
                imagePosition: var2
              },
            };
            break;
          case 'statusPhoto':
            uploadSettings.meta = {
              directions: {
                type: imageType,
                statusId: var1
              },
            };
            break;
        }

        const upload = Images.insert(uploadSettings, false);

        upload.on('start', function () {
          //toast.info('Uploading...');
          //console.log('Uploading: ', this);
        });

        upload.on('end', (error, a) => {
          if (error) {
            toast.error(error.message);
            reject(error);
          } else {
            resolve(a);
          }
        });
        upload.start();
      }else{
        reject();
      }
    });
  };

  componentDidUpdate = (prevProps, prevState) => {
    if(!this.props.loading && prevProps != this.props){
      this.setState({...prevState, status: this.props.status});
    }
  }

  componentDidMount = () => {
    if(this.props.status && !this.props.statusId){
      if(this.props.status.public){
        this.props.status.public = this.props.privacySettings[1];
      }else{
        this.props.status.public = this.props.privacySettings[0];
      }
      this.setState({status: this.props.status});
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    let status = _.cloneDeep(this.state.status);
    delete status._id;
    if(this.state.image){
      status.imageUploading = true;
    }

    if(status.public && status.public.value){
      status.public = true;
    }else{
      status.public = false;
    }

    Meteor.call('status.edit', this.state.status._id, status, error=>{
      if(error){
        this.props.errorCallback(error);
      }else{
        if(this.state.image){
          toast.info('Uploading image...');
          this.uploadImage(this.state.image, 'statusPhoto', this.state.status._id).then(success=>{
            if(success){
              this.props.successCallback();
            }else{
              this.props.errorCallback();
            }
          });;
        }else{
          this.setState({status: {}, image: false});
          this.refs.image.value = '';
          this.props.successCallback();
        }
      }
    });
  }

  render(){

    /*
    {!this.props.loading && this.props.settings.showPrivacy &&
      <div className="form-group">
          <Checkbox id="public" label="Publicly Viewable" checked={this.state.status.public } onChange={(e)=>this.updateStatusValue(e.target.checked, 'public')} />
      </div>
    }
    */

    return (
      <form onSubmit={this.handleSubmit} className="status edit">
        {!this.props.loading && this.props.settings.showTitle &&
            <div className="form-group">
            <label htmlFor="name">Headline</label>
            <input type="text" id="name" value={this.state.status.name || ''} onChange={e=>{this.updateStatusValue(e.target.value, 'name')}} className="form-control" />
          </div>
        }
        {!this.props.loading && this.props.settings.showImage &&
            <div className="form-group">
            {this.state.status.image && !this.state.tempImage &&
              <img src={this.state.status.image} />
            }
            {this.state.tempImage &&
              <img src={this.state.tempImage} />
            }
            <label htmlFor="image" className="btn btn-primary">Upload Image</label>
            <input type="file" id="image" onChange={e=>{this.selectedImage(e)}}/>
          </div>
        }
        {!this.props.loading && this.props.settings.showDescription &&
          <div className="form-group">
            <label htmlFor="description">Content</label>
            <textarea id="description" value={this.state.status.description || ''} onChange={e=>{this.updateStatusValue(e.target.value, 'description')}} className="form-control" />
          </div>
        }
        <Select
          value={this.state.status.public}
          isMulti={false}
          onChange={value=>this.updateStatusValue(value, 'public')}
          options={this.props.privacySettings}
        />
        <div className="spacer v20"></div>
        <input type="submit" className="btn btn-primary" value="Save" /> &nbsp;
        {this.props.cancelCallback && <a href="" className="btn btn-secondary" onClick={this.props.cancelCallback}>Cancel</a>}
      </form>
    );
  }
};

export default withTracker(props => {
  let loading = true,
      status = {};
  const handles = [];
  if(props.statusId){
    handles.push(Meteor.subscribe('status', props.statusId));
    status = Statuses.findOne(props.statusId);
    loading = handles.some(handle => !handle.ready());
  }else{
    status = props.status;
    loading = false;
  }



  return {
    loading,
    status,
  };
})(EditStatusTemplate);
