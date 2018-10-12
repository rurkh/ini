import { connect } from 'react-redux';
import { compose, withProps, lifecycle } from 'recompose';
import { withFormik } from 'formik/dist/formik';

import schema from 'modules/deliverers/schema';
import { setDelivererTime } from 'modules/deliverers/deliverers';
import AssignmentFormFields from 'components/districts/AssignmentFormFields';
import EntityFormDialog from 'components/dialog/EntityFormDialog';
import withTrans from 'components/hoc/withTrans';
import {
  fetchUsers,
  makeGetUsersListByRole,
  isUsersLoading,
  getUsersError,
} from 'modules/users/users';

const makeMapStateToProps = () => {
  const getUsersListByRole = makeGetUsersListByRole('deliverer');
  return state => ({
    deliverers: getUsersListByRole(state),
    isLoading: isUsersLoading(state),
    isError: getUsersError(state),
  });
};

const storeEnhancer = connect(makeMapStateToProps, {
  setDelivererTime,
  fetchUsers,
});

const formEnhancer = withFormik({
  mapPropsToValues: () => ({}),
  validationSchema: schema,
  handleSubmit: (values, { props, setSubmitting }) => {
    const { district } = props.match.params;

    const payload = schema.cast(values, { context: { mode: 'create' } });
    payload.username = payload.deliverer.username;
    props.setDelivererTime(district, payload);
    setSubmitting(false);

    props.history.push(`/districts/${district}`);
  },
});

export const CreateAssignmentDialog = compose(
  withTrans,
  storeEnhancer,
  lifecycle({
    componentDidMount() {
      const { deliverers } = this.props;
      if (!deliverers.length) {
        this.props.fetchUsers({
          role: 'deliverer',
        });
      }
    },
  }),
  withProps({
    title: 'deliverers.assignment.create',
    fieldsComponent: AssignmentFormFields,
  }),
  formEnhancer
)(EntityFormDialog);
