import React from 'react';
import PropTypes from 'prop-types';
import { compose, withHandlers } from 'recompose';
import { Button } from 'primereact/components/button/Button';

import Dialog from './Dialog';
import withTrans from 'components/hoc/withTrans';

const EntityFormDialog = ({ fieldsComponent: Component, title, ...props }) => {
  return (
    <Dialog
      header={props.trans(title)}
      visible
      modal
      draggable={false}
      onHide={props.onCancel}
    >
      <form onSubmit={props.handleSubmit}>
        <div className="form-body">
          <Component {...props} />
        </div>
        <div className="form-actions">
          <Button
            icon="fa-close"
            type="button"
            label={props.trans('app.dialog.button.cancel')}
            disabled={props.isSubmitting}
            onClick={props.onCancel}
          />
          <Button
            icon="fa-check"
            label={props.trans('app.dialog.button.ok')}
            disabled={props.isSubmitting}
          />
        </div>
      </form>
    </Dialog>
  );
};

EntityFormDialog.propTypes = {
  isSubmitting: PropTypes.bool,
  fieldsComponent: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  trans: PropTypes.func.isRequired,
};

const enhancer = compose(
  withTrans,
  withHandlers({
    onCancel: ({ handleReset, history }) => () => {
      handleReset();
      history.goBack();
    },
  })
);
export default enhancer(EntityFormDialog);
