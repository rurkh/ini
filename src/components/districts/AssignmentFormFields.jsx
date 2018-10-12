import React, { Fragment, Component } from 'react';
import { Calendar } from 'primereact/components/calendar/Calendar';

import FieldFeedback from 'components/form/FieldFeedback';
import UsersTable from 'components/users/UsersTable';

const visibleUserFilters = ['tags', 'districts'];

class AssignmentFormFields extends Component {
  handleSelectChange = ({ data: user }) => {
    this.props.setFieldValue('deliverer', user);
  };

  handleStartTimeChange = ({ value }) => {
    this.props.setFieldValue('start_date', value);
  };

  handleEndTimeChange = ({ value }) => {
    this.props.setFieldValue('end_date', value);
  };

  render() {
    const {
      values,
      touched,
      errors,
      trans,
      deliverers,
      isLoading,
    } = this.props;
    return (
      <Fragment>
        <FieldFeedback error={touched.deliverer && errors.deliverer} />
        <UsersTable
          isLoading={isLoading}
          users={deliverers}
          selectedUser={values.deliverer}
          trans={trans}
          onRowSelect={this.handleSelectChange}
          visibleFilters={visibleUserFilters}
        />

        <div className="form-item row">
          <div className="col-6">
            <div className="md-inputfield">
              <label>
                {trans('deliverers.column.start_date')}
                <span className="field-required">*</span>
              </label>
              <Calendar
                dateFormat="dd.mm.yy"
                value={values.start_date}
                readOnlyInput
                onChange={this.handleStartTimeChange}
                showIcon
                required
              />
            </div>
            <FieldFeedback error={touched.start_date && errors.start_date} />
          </div>
          <div className="col-6">
            <div className="md-inputfield">
              <label>{trans('deliverers.column.end_date')}</label>
              <Calendar
                dateFormat="dd.mm.yy"
                value={values.end_date}
                readOnlyInput
                onChange={this.handleEndTimeChange}
                showIcon
              />
            </div>
            <FieldFeedback error={touched.end_date && errors.end_date} />
          </div>
        </div>
      </Fragment>
    );
  }
}

export default AssignmentFormFields;
