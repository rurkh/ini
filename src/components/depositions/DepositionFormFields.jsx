import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { InputTextarea } from 'primereact/components/inputtextarea/InputTextarea';

import TextField from 'components/form/TextField';
import FieldFeedback from 'components/form/FieldFeedback';
import LocationField from 'components/form/LocationField';

class DepositionFormFields extends Component {
  static propTypes = {
    mode: PropTypes.oneOf(['edit', 'create']).isRequired,
  };

  handleLocationChange = values => {
    this.props.setValues({ ...this.props.values, ...values });
  };

  render() {
    const { mode, values, touched, errors, trans, handleChange } = this.props;

    return (
      <div className="form-group">
        <div className="form-item">
          <TextField
            id="id"
            type="text"
            name="id"
            required
            readOnly={mode === 'edit'}
            label={trans('depositions.fields.id')}
            onChange={handleChange}
            value={values.id}
            error={touched.id && errors.id}
          />
        </div>
        <div className="form-item">
          <TextField
            id="name"
            type="text"
            name="name"
            required
            label={trans('depositions.fields.name')}
            onChange={handleChange}
            value={values.name}
            error={touched.name && errors.name}
          />
        </div>
        <div className="form-item">
          <TextField
            id="perimeter"
            type="number"
            name="perimeter"
            min={1}
            step={1}
            required
            label={trans('depositions.fields.perimeter')}
            onChange={handleChange}
            value={values.perimeter}
            error={touched.perimeter && errors.perimeter}
          />
        </div>
        <div className="py-10" />
        <LocationField value={values} onChange={this.handleLocationChange} />
        <div className="py-10" />
        <div className="form-item">
          <div className="md-inputfield">
            <label htmlFor="hint">{trans('depositions.fields.hint')}</label>
            <InputTextarea
              id="hint"
              name="hint"
              autoResize
              value={values.hint}
              onChange={handleChange}
            />
            <FieldFeedback error={touched.hint && errors.hint} />
          </div>
        </div>
      </div>
    );
  }
}

export default DepositionFormFields;
