import React, { Fragment } from 'react';
import { Calendar } from 'primereact/components/calendar/Calendar';
import formatDate from 'date-fns/format';
import subYears from 'date-fns/sub_years';
import startOfYear from 'date-fns/start_of_year';
import endOfYear from 'date-fns/end_of_year';
import isWithinRange from 'date-fns/is_within_range';

import FieldFeedback from './FieldFeedback';

const minDate = startOfYear(subYears(new Date(), 70));
const maxDate = endOfYear(subYears(new Date(), 14));
const minYear = formatDate(minDate, 'YYYY');
const maxYear = formatDate(maxDate, 'YYYY');
const yearRange = `${minYear}:${maxYear}`;

const BirthdateField = ({ label, error, ...props }) => {
  return (
    <Fragment>
      {!!label && <label htmlFor="birthdate">{label}</label>}
      <Calendar
        dateFormat="dd.mm.yy"
        showIcon
        readOnlyInput
        id="birthdate"
        monthNavigator
        yearNavigator
        {...{ minDate, maxDate, yearRange, defaultDate: maxDate }}
        {...props}
      />
      <FieldFeedback error={error} />
    </Fragment>
  );
};

export default BirthdateField;

export const isValidBirthdate = value => isWithinRange(value, minDate, maxDate);
