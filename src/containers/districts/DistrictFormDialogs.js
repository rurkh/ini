import { withFormik } from 'formik';
import { compose, withProps } from 'recompose';
import { connect } from 'react-redux';
import _pick from 'lodash/pick';

import withTrans from 'components/hoc/withTrans';
import EntityFormDialog from 'components/dialog/EntityFormDialog';
import DistrictFormFields from 'components/districts/DistrictFormFields';
import { createDistrict, updateDistrict } from 'modules/districts/districts';
import districtSchema from 'modules/districts/schema';
import createValidator from 'utils/createFormikValidator';

const actionEnhancer = connect(null, { createDistrict, updateDistrict });
const editableDistrictFields = [
  'id',
  'name',
  'distance',
  'means_of_transportation',
  'deposition',
  'deliverer_manager',
  'alarm_threshold',
  'nominal_delivery_time',
  'latest_start_time',
];
const formEnhancer = withFormik({
  mapPropsToValues: ({ district }) =>
    districtSchema.cast(_pick(district, editableDistrictFields), {
      context: { mode: 'form' },
    }),
  enableReinitialize: true,
  validate: createValidator(districtSchema),
  handleSubmit: (values, { props, setSubmitting }) => {
    const payload = districtSchema.cast(values, { context: props });

    props.mode === 'create' && props.createDistrict(payload);
    props.mode === 'edit' && props.updateDistrict(payload);
    setSubmitting(false);

    props.history.push(`/districts/${payload.id}`);
  },
});

export const CreateDistrictDialog = compose(
  withTrans,
  withProps({
    mode: 'create',
    title: 'districts.header.create_district',
    fieldsComponent: DistrictFormFields,
  }),
  actionEnhancer,
  formEnhancer
)(EntityFormDialog);

export const EditDistrictDialog = compose(
  withTrans,
  withProps({
    mode: 'edit',
    title: 'districts.header.edit_district',
    fieldsComponent: DistrictFormFields,
  }),
  actionEnhancer,
  formEnhancer
)(EntityFormDialog);
