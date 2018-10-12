import React, { Fragment, PureComponent } from 'react';
import { Calendar } from 'primereact/components/calendar/Calendar';
import { InputTextarea } from 'primereact/components/inputtextarea/InputTextarea';

import TextField from 'components/form/TextField';
import LocationField from 'components/form/LocationField';
import FieldFeedback from 'components/form/FieldFeedback';

class ReclamationFormFields extends PureComponent {
  onDateChange = ({ value }) => {
    this.props.setFieldValue('reclamation_date', value);
  };
  handleLocationChange = values => {
    this.props.setValues({ ...this.props.values, ...values });
  };

  render() {
    const { trans, values, touched, errors, handleChange } = this.props;
    return (
      <Fragment>
        <div className="form-item">
          <div className="md-inputfield">
            <label htmlFor="hint">{trans('characteristic.fields.text')}</label>
            <InputTextarea
              id="text"
              name="text"
              autoResize
              required
              value={values.text}
              onChange={handleChange}
            />
            <FieldFeedback error={touched.text && errors.text} />
          </div>
        </div>
        <div className="form-item row">
          <div className="col-7">
            <TextField
              id="contact_person"
              type="text"
              name="contact_person"
              label={trans('reclamation.fields.contact_person')}
              onChange={handleChange}
              value={values.contact_person}
              error={touched.contact_person && errors.contact_person}
            />
          </div>
          <div className="col-5">
            <span className="md-inputfield">
              <label htmlFor="birthdate">
                {trans('reclamation.fields.date')}
              </label>
              <Calendar
                showIcon
                id="reclamation_date"
                dateFormat="dd.mm.yy"
                onSelect={this.onDateChange}
                maxDate={new Date()}
                value={values.reclamation_date}
              />
              <FieldFeedback
                error={touched.reclamation_date && errors.reclamation_date}
              />
            </span>
          </div>
        </div>
        <div className="py-10" />
        <div>
          <LocationField value={values} onChange={this.handleLocationChange} />
          <FieldFeedback error={touched.position && errors.position} />
        </div>
      </Fragment>
    );
  }
}

export default ReclamationFormFields;
