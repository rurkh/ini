import { object, string, number, lazy } from 'yup';

const msgRequired = 'app.validation.field_required';
const msgPostcode = 'app.validation.invalid_postcode';

const coordinateSchema = lazy((value, { context }) => {
  if (context && context.mode === 'list') {
    return value === null ? string().ensure() : number();
  }
  return number().required(msgRequired);
});

export default object().shape({
  id: string()
    .ensure()
    .required(msgRequired)
    .trim(),
  name: string()
    .ensure()
    .required(msgRequired)
    .trim(),

  perimeter: lazy((value, { context }) => {
    if (context && context.mode === 'list') {
      return value === null ? string().ensure() : number();
    }
    return number()
      .required(msgRequired)
      .positive();
  }),

  street: string()
    .ensure()
    .nullable()
    .trim(),

  postal_code: string()
    .ensure()
    .nullable()
    .max(20, msgPostcode)
    .trim(),

  city: string()
    .ensure()
    .nullable()
    .trim(),

  position: object({
    lat: coordinateSchema,
    lng: coordinateSchema,
  }).when(
    '$mode',
    (mode, schema) =>
      mode === 'list' ? schema.default({}) : schema.required(msgRequired)
  ),

  hint: string()
    .ensure()
    .nullable()
    .trim(),
});
