import { withFormik } from 'formik';
import { compose, withProps } from 'recompose';
import { connect } from 'react-redux';
import _pick from 'lodash/pick';

import CharacteristicFormFields from 'components/characteristics/CharacteristicFormFields';
import {
  createCharacteristics,
  updateCharacteristics,
} from 'modules/delivery_characteristics/delivery_characteristics';
import EntityFormDialog from 'components/dialog/EntityFormDialog';
import withTrans from 'components/hoc/withTrans';
import schema from 'modules/delivery_characteristics/schema';

const actionEnhancer = connect(null, {
  createCharacteristics,
  updateCharacteristics,
});
const editableCharacteristicFields = [
  'hint',
  'street',
  'postal_code',
  'city',
  'position',
  'image',
];
const formEnhancer = withFormik({
  mapPropsToValues: ({
    characteristic = {},
    match: { params: { district } },
  }) => {
    return {
      active: true,
      district_id: district,
      ..._pick(characteristic, editableCharacteristicFields),
    };
  },
  validationSchema: schema,
  handleSubmit: (values, { props, setSubmitting }) => {
    const { characteristic, district } = props.match.params;
    const payload = schema.cast({ district_id: district, ...values });

    props.mode === 'create' && props.createCharacteristics(payload);
    props.mode === 'edit' &&
      props.updateCharacteristics(characteristic, payload);

    setSubmitting(false);
    props.history.push(`/districts/${district}`);
  },
});

export const CreateCharacteristicDialog = compose(
  withTrans,
  withProps({
    mode: 'create',
    title: 'characteristics.header.new_delivery_characteristics',
    fieldsComponent: CharacteristicFormFields,
  }),
  actionEnhancer,
  formEnhancer
)(EntityFormDialog);

export const EditCharacteristicDialog = compose(
  withTrans,
  withProps({
    mode: 'edit',
    title: 'characteristics.header.edit_delivery_characteristics',
    fieldsComponent: CharacteristicFormFields,
  }),
  actionEnhancer,
  formEnhancer
)(EntityFormDialog);
