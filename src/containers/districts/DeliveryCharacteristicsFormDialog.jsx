import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Dialog from 'components/dialog/Dialog';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { withFormik } from 'formik';
import { compose } from 'redux';
import { connect } from 'react-redux';
import _pick from 'lodash/pick';

import transMsg from 'utils/transMsg';
import DeliveryCharacteristicsForm from 'components/deliveryCharacteristics/DeliveryCharacteristicsForm';
import {
  createCharacteristics,
  updateCharacteristics,
} from 'modules/delivery_characteristics/delivery_characteristics';
import schema from 'modules/delivery_characteristics/schema';

class DeliveryCharacteristicsFormDialog extends PureComponent {
  static propTypes = {
    mode: PropTypes.oneOf([`edit`, `create`]).isRequired,
    intl: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    characteristic: PropTypes.object,
  };

  closeDialog = () => {
    const {
      handleReset,
      history,
      match: { params: { district } },
    } = this.props;
    handleReset();
    history.push(`/districts/${district}`);
  };

  trans = id => this.props.intl.formatMessage(transMsg(id));

  render() {
    const { mode } = this.props;
    const header =
      mode === 'create'
        ? 'characteristics.header.new_delivery_characteristics'
        : 'characteristics.header.edit_delivery_characteristics';
    return (
      <Dialog
        header={this.trans(header)}
        width="650px"
        visible
        modal
        onHide={this.closeDialog}
      >
        <DeliveryCharacteristicsForm
          {...this.props}
          trans={this.trans}
          onCancel={this.closeDialog}
        />
      </Dialog>
    );
  }
}

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
  mapPropsToValues: ({ characteristic = {} }) => {
    return _pick(characteristic, editableCharacteristicFields);
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
const enhancer = compose(injectIntl, withRouter, actionEnhancer, formEnhancer);
export default enhancer(DeliveryCharacteristicsFormDialog);
