import { object, string, ref, mixed, date } from 'yup';
import isAfter from 'date-fns/is_after';
import isEqual from 'date-fns/is_equal';
import formatDate from 'date-fns/format';

const msgRequired = 'app.validation.field_required';
const msgEndDate = 'app.validation.assignment_invalid_end_date';

function endDateValidation(endDate) {
  if (!endDate) {
    return true;
  }
  const startDate = this.resolve(ref('start_date'));
  if (!startDate) {
    return false;
  }
  return isEqual(startDate, endDate) || isAfter(endDate, startDate);
}

const dateTransformer = value =>
  value ? formatDate(value, 'YYYY-MM-DD') : value;

export default object().shape({
  // TODO: doesn't work
  // username: ref('deliverer.username'),
  deliverer: object({ username: string() }).required(msgRequired),

  start_date: mixed().when('$mode', mode => {
    if (['edit', 'create'].includes(mode)) {
      return string()
        .required(msgRequired)
        .transform(dateTransformer);
    }
    return date();
  }),

  end_date: mixed().when('$mode', mode => {
    if (['edit', 'create'].includes(mode)) {
      return string()
        .test('end_date', msgEndDate, endDateValidation)
        .transform(dateTransformer);
    }
    return date().nullable();
  }),
});
