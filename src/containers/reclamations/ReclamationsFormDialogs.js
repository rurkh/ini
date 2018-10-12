import { withFormik } from 'formik';
import { compose, withProps } from 'recompose';
import { connect } from 'react-redux';
import _pick from 'lodash/pick';

import ReclamationFormFields from 'components/reclamations/ReclamationFormFields';
import EntityFormDialog from 'components/dialog/EntityFormDialog';
import withTrans from 'components/hoc/withTrans';
import {
  createReclamation,
  updateReclamation,
} from 'modules/reclamation/reclamation';
import schema from 'modules/reclamation/schema';

const actionEnhancer = connect(null, {
  createReclamation,
  updateReclamation,
});
const editableReclamationFields = [
  'text',
  'contact_person',
  'reclamation_date',
  'street',
  'postal_code',
  'city',
  'position',
];
const formEnhancer = withFormik({
  mapPropsToValues: ({ reclamation = {} }) => {
    const values = _pick(reclamation, editableReclamationFields);
    if (values.reclamation_date && !(values.reclamation_date instanceof Date)) {
      values.reclamation_date = new Date(values.reclamation_date);
    }
    return values;
  },
  validationSchema: schema,
  handleSubmit: (values, { props, setSubmitting }) => {
    const { reclamation, district } = props.match.params;
    const payload = schema.cast({ district_id: district, ...values });

    props.mode === 'create' && props.createReclamation(payload);
    props.mode === 'edit' && props.updateReclamation(reclamation, payload);

    setSubmitting(false);
    props.history.push(`/districts/${district}`);
  },
});

export const CreateReclamationDialog = compose(
  withTrans,
  withProps({
    mode: 'create',
    title: 'reclamations.header.new_reclamation',
    fieldsComponent: ReclamationFormFields,
  }),
  actionEnhancer,
  formEnhancer
)(EntityFormDialog);

export const EditReclamationDialog = compose(
  withTrans,
  withProps({
    mode: 'edit',
    title: 'reclamations.header.edit_reclamation',
    fieldsComponent: ReclamationFormFields,
  }),
  actionEnhancer,
  formEnhancer
)(EntityFormDialog);
