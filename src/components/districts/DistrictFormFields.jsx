import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Calendar } from 'primereact/components/calendar/Calendar';

import TextField from 'components/form/TextField';
import FieldFeedback from 'components/form/FieldFeedback';
import MeanOfTransport from 'components/filters/MeansOfTransportation';
import DepositionField from 'components/form/DepositionField';
import UsersField from 'components/form/UserAutocomplete';

class DepositionFormFields extends Component {
  static propTypes = {
    mode: PropTypes.oneOf(['edit', 'create']).isRequired,
  };

  handleLocationChange = values => {
    this.props.setValues({ ...this.props.values, ...values });
  };

  handleSelectChange = ({ target: { name, value } }) => {
    this.props.setFieldValue(name, value);
  };

  handleManagerChange = ({ value }) => {
    this.props.setFieldValue(
      'deliverer_manager',
      typeof value === 'object' ? value.username : value
    );
  };

  handleStartTimeChange = ({ value }) => {
    this.props.setFieldValue('latest_start_time', value);
  };

  render() {
    const { mode, values, touched, errors, handleChange, trans } = this.props;

    return (
      <div className="row">
        <div className="col-7">
          <div className="form-item">
            <TextField
              id="id"
              type="text"
              name="id"
              required
              readOnly={mode === 'edit'}
              label={trans('districts.fields.id')}
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
              label={trans('districts.fields.name')}
              onChange={handleChange}
              value={values.name}
              error={touched.name && errors.name}
            />
          </div>
          <div className="form-item">
            <div className="md-inputfield">
              <label htmlFor="mean-of-transport">
                {trans('districts.fields.means_of_transportation')}
              </label>
            </div>
            <MeanOfTransport
              inputId="mean-of-transport"
              multiSelect={false}
              onChange={this.handleSelectChange}
              value={values.means_of_transportation}
            />
            <FieldFeedback
              error={
                touched.means_of_transportation &&
                errors.means_of_transportation
              }
            />
          </div>
          <div className="form-item">
            <div className="md-inputfield">
              <label htmlFor="deposition">
                {trans('districts.fields.deposition')}
                <span className="field-required">*</span>
              </label>
            </div>
            <DepositionField
              inputId="deposition"
              required
              label={trans('districts.fields.deposition')}
              onChange={this.handleSelectChange}
              value={values.deposition}
            />
            <FieldFeedback error={touched.deposition && errors.deposition} />
          </div>
          <div className="form-item">
            <div className="md-inputfield">
              <label htmlFor="deliverer-manager">
                {trans('districts.fields.deliverer_manager')}
                <span className="field-required">*</span>
              </label>
              <UsersField
                inputId="deliverer-manager"
                roleName="deliverer_manager"
                minLength={3}
                field="username"
                label={trans('districts.fields.deliverer_manager')}
                onChange={this.handleManagerChange}
                value={values.deliverer_manager}
              />
              <FieldFeedback
                error={touched.deliverer_manager && errors.deliverer_manager}
              />
            </div>
          </div>
        </div>
        <div className="col-5">
          <div className="form-item">
            <TextField
              id="distance"
              type="text"
              name="distance"
              required
              label={trans('districts.fields.distance')}
              suffix={trans('districts.distance.suffix', 'km')}
              onChange={handleChange}
              value={values.distance}
              error={touched.distance && errors.distance}
            />
          </div>
          <div className="form-item">
            <TextField
              id="alarm_threshold"
              type="number"
              name="alarm_threshold"
              min={0}
              max={60}
              step={5}
              label={trans('districts.fields.alarm_threshold')}
              suffix={trans('districts.alarm_threshold.suffix', 'min')}
              onChange={handleChange}
              value={values.alarm_threshold}
              error={touched.alarm_threshold && errors.alarm_threshold}
            />
          </div>
          <div className="form-item">
            <TextField
              id="nominal_delivery_time"
              type="text"
              name="nominal_delivery_time"
              required
              min={10}
              max={150}
              step={5}
              label={trans('districts.fields.target_time')}
              suffix={trans('districts.target_time.suffix', 'min')}
              onChange={handleChange}
              value={values.nominal_delivery_time}
              error={
                touched.nominal_delivery_time && errors.nominal_delivery_time
              }
            />
          </div>
          <div className="form-item">
            <div className="ui-inputgroup">
              <div className="md-inputfield">
                <label htmlFor="start-time">
                  {trans('districts.fields.latest_start_time')}
                </label>
                <Calendar
                  inputId="start-time"
                  timeOnly
                  value={values.latest_start_time}
                  onChange={this.handleStartTimeChange}
                />
              </div>
              <span className="ui-inputgroup-addon">
                {trans('districts.latest_start_time.suffix', "o'clock")}
              </span>
            </div>
            <FieldFeedback
              error={touched.latest_start_time && errors.latest_start_time}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default DepositionFormFields;
