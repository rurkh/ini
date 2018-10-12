import { object, string, mixed, boolean } from 'yup';

const msgRequired = 'app.validation.field_required';
const msgPosition = 'app.validation.invalid_position';
const msgPostcode = 'app.validation.invalid_postcode';

const positionValidation = value => !value || !isNaN(value);

export default object().shape({
  hint: string()
    .required(msgRequired)
    .trim(),
  street: string()
    .nullable()
    .trim(),
  postal_code: string()
    .nullable()
    .max(20, msgPostcode)
    .trim(),
  city: string()
    .nullable()
    .trim(),
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
  active: boolean().default(true),
  image: string()
    .nullable()
    .trim(),
});
