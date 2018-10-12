import { object, string, mixed } from 'yup';
import formatDate from 'date-fns/format';

const msgRequired = 'app.validation.field_required';
const msgPosition = 'app.validation.invalid_position';
const msgPostcode = 'app.validation.invalid_postcode';
const msgDate = 'app.validation.invalid_date';

const positionValidation = value => !value || !isNaN(value);
const validationDate = value => {
  return !value || new Date(value) <= new Date();
};

export default object().shape({
  text: string()
    .required(msgRequired)
    .trim(),

  contact_person: string()
    .nullable()
    .trim(),

  street: string()
    .nullable()
    .trim(),
  postcode: string()
    .nullable()
    .max(20, msgPostcode)
    .trim(),
  city: string()
    .nullable()
    .trim(),

  reclamation_date: string()
    .test('reclamation_date', msgDate, validationDate)
    .transform(value => (value ? formatDate(value, 'YYYY-MM-DD') : value)),

  position: object()
    .required(msgRequired)
    .shape({
      lat: mixed()
        .required(msgRequired)
        .test('position', msgPosition, positionValidation),
      lng: mixed()
        .required(msgRequired)
        .test('position', msgPosition, positionValidation),
    }),
});
