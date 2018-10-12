import React, { Component, Fragment } from 'react';
import { InputTextarea } from 'primereact/components/inputtextarea/InputTextarea';

import LocationField from 'components/form/LocationField';
import FieldFeedback from 'components/form/FieldFeedback';
import UploadPicture from 'components/form/UploadPicture';

class CharacteristicFormFields extends Component {
  handleImageChange = picture => {
    this.props.setFieldValue('image', picture);
  };

  handleLocationChange = values => {
    this.props.setValues({ ...this.props.values, ...values });
  };

  render() {
    const { trans, values, touched, errors, handleChange } = this.props;
    return (
      <Fragment>
        <div className="row form-item">
          <div className="col-6">
            <div className="md-inputfield d-flex">
              <label htmlFor="hint">
                {trans('characteristic.fields.hint')}
              </label>
              <InputTextarea
                id="hint"
                name="hint"
                autoResize
                required
                value={values.hint}
                onChange={handleChange}
              />
              <FieldFeedback error={touched.hint && errors.hint} />
            </div>
          </div>
          <div className="col-6">
            <UploadPicture
              value={values.image}
              setValue={this.handleImageChange}
            />
          </div>
        </div>
        <div className="py-10" />
        <LocationField value={values} onChange={this.handleLocationChange} />
      </Fragment>
    );
  }
}

export default CharacteristicFormFields;
