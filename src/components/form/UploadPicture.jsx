import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import { injectIntl } from 'react-intl';
import transMsg from 'utils/transMsg';
import classNames from 'classnames/bind';
import { Button } from 'primereact/components/button/Button';

class UploadPicture extends Component {
  static propTypes = {
    setValue: PropTypes.func.isRequired,
    value: PropTypes.string,
  };

  trans = id => this.props.intl.formatMessage(transMsg(id));

  handleImageChange = acceptedFiles => {
    if (acceptedFiles.length) {
      const reader = new FileReader();
      const [file] = acceptedFiles;
      const isImage = file.type.match(/image/);
      reader.onloadend = () => {
        this.props.setValue(reader.result);
      };
      isImage && reader.readAsDataURL(file);
    }
  };

  handleDelete = event => {
    event.stopPropagation();
    this.props.setValue(null);
  };

  render() {
    const { value } = this.props;
    return (
      <div className="md-inputfield">
        <label>{this.trans('app.uploader.text.upload_picture')}</label>
        <Dropzone
          className={classNames('dropzone', { 'dropzone-uploaded': !!value })}
          multiple={false}
          accept="image/*"
          onDrop={this.handleImageChange}
        >
          {value ? (
            <Fragment>
              <Button
                type="button"
                icon="ui-icon-clear"
                className="red-btn dropzone__btn-delete"
                onClick={this.handleDelete}
              />
              <img className="dropzone__picture" src={value} alt="" />
            </Fragment>
          ) : (
            <Fragment>
              <span className="fa ui-icon-image dropzone__icon" />
              <div className="dropzone__text">
                {this.trans('app.uploader.text.upload_picture')}
              </div>
            </Fragment>
          )}
        </Dropzone>
      </div>
    );
  }
}
export default injectIntl(UploadPicture);
