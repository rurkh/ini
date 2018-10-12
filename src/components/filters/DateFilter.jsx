import React, { PureComponent } from 'react';
import { Calendar } from 'primereact/components/calendar/Calendar';

const maxDate = new Date();

class DateFilter extends PureComponent {
  render() {
    const {
      trans,
      date_from,
      date_to,
      onChangeDateFrom,
      onChangeDateTo,
    } = this.props;

    return (
      <div className="data-filter py-15">
        <div class="row">
          <div className="col-6">
            <div className="md-inputfield">
              <label htmlFor="date_from">
                {trans('messages.fields.date_from')}
              </label>
              <Calendar
                showIcon
                id="date_from"
                name="date_from"
                dateFormat="dd.mm.yy"
                onSelect={onChangeDateFrom}
                maxDate={maxDate}
                value={date_from}
              />
            </div>
          </div>
          <div className="col-6">
            <div className="md-inputfield">
              <label htmlFor="date_to">
                {trans('messages.fields.date_to')}
              </label>
              <Calendar
                showIcon
                id="date_to"
                name="date_to"
                dateFormat="dd.mm.yy"
                onSelect={onChangeDateTo}
                maxDate={maxDate}
                value={date_to}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DateFilter;
