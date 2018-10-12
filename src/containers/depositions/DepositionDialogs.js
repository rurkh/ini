import { withFormik } from 'formik';
import { compose, withProps } from 'recompose';
import { connect } from 'react-redux';
import _pick from 'lodash/pick';

import {
  createDeposition,
  updateDeposition,
} from 'modules/depositions/depositions';
import DepositionFormFields from 'components/depositions/DepositionFormFields';
import withTrans from 'components/hoc/withTrans';
import EntityFormDialog from 'components/dialog/EntityFormDialog';
import schema from 'modules/depositions/schema';
import createValidator from 'utils/createFormikValidator';

const actionEnhancer = connect(null, { createDeposition, updateDeposition });
const editableDepositionFields = [
  'id',
  'name',
  'perimeter',
  'street',
  'postal_code',
  'city',
  'position',
  'hint',
];
const formEnhancer = withFormik({
  mapPropsToValues: ({ deposition }) =>
    schema.cast(_pick(deposition, editableDepositionFields), {
      context: { mode: 'form' },
    }),
  enableReinitialize: true,
  validate: createValidator(schema),
  handleSubmit: (values, { props, setSubmitting }) => {
    const payload = schema.cast(values, { context: props });

    props.mode === 'create' && props.createDeposition(payload);
    props.mode === 'edit' && props.updateDeposition(payload);
    setSubmitting(false);

    props.history.push(`/depositions/${payload.id}`);
  },
});

export const CreateDepositionDialog = compose(
  withTrans,
  withProps({
    mode: 'create',
    title: 'depositions.header.create_deposition',
    fieldsComponent: DepositionFormFields,
  }),
  actionEnhancer,
  formEnhancer
)(EntityFormDialog);

export const EditDepositionDialog = compose(
  withTrans,
  withProps({
    mode: 'edit',
    title: 'depositions.header.edit_deposition',
    fieldsComponent: DepositionFormFields,
  }),
  actionEnhancer,
  formEnhancer
)(EntityFormDialog);
