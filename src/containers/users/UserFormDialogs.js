import { withFormik } from 'formik';
import { compose, withProps } from 'recompose';
import { connect } from 'react-redux';
import _pick from 'lodash/pick';

import { createUser, updateUser } from 'modules/users/users';
import withTrans from 'components/hoc/withTrans';
import UserFormFields from 'components/users/UserFormFields';
import EntityFormDialog from 'components/dialog/EntityFormDialog';
import schema from 'modules/users/schema';
import createValidator from 'utils/createFormikValidator';

const actionEnhancer = connect(null, { createUser, updateUser });
const editableUserFields = [
  'username',
  'firstname',
  'lastname',
  'street',
  'city',
  'postcode',
  'phone',
  'email',
  'tags',
  'gender',
  'birthdate',
  'sms_notification',
  'email_notification',
  'push_notification',
  'notifications',
  'user_roles',
  'representations',
];
const formEnhancer = withFormik({
  mapPropsToValues: ({ user, location, mode }) =>
    schema.cast(_pick(user, editableUserFields), { context: { mode: 'form' } }),
  enableReinitialize: true,
  validate: createValidator(schema),
  handleSubmit: (values, { props, setSubmitting }) => {
    const payload = schema.cast(values, { context: props });

    props.mode === 'create' && props.createUser(payload);
    props.mode === 'edit' && props.updateUser(payload);
    setSubmitting(false);

    props.history.push(`/users/${payload.username}`);
  },
});

export const CreateUserDialog = compose(
  withTrans,
  withProps({
    mode: 'create',
    title: 'users.header.create_user',
    fieldsComponent: UserFormFields,
  }),
  actionEnhancer,
  formEnhancer
)(EntityFormDialog);

export const EditUserDialog = compose(
  withTrans,
  withProps({
    mode: 'edit',
    title: 'users.header.edit_user',
    fieldsComponent: UserFormFields,
  }),
  actionEnhancer,
  formEnhancer
)(EntityFormDialog);
