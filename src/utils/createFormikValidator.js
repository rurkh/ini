import { validateYupSchema, yupToFormErrors } from 'formik';

export default schema => (values, props) => {
  return validateYupSchema(values, schema, props).catch(errors => {
    throw yupToFormErrors(errors);
  });
};
