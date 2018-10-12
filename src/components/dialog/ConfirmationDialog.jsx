import React, { PureComponent } from 'react';
import { Button } from 'primereact/components/button/Button';
import { injectIntl } from 'react-intl';

import Dialog from './Dialog';

const modalButtons = {
  yes: {
    id: 'modal_buttons.yes',
    defaultMessage: 'Yes',
  },

  no: {
    id: 'modal_buttons.no',
    defaultMessage: 'No',
  },
};

class ConfirmationDialog extends PureComponent {
  handleConfirm = () => {
    this.props.onHide({ confirm: true });
  };

  handleCancel = () => {
    this.props.onHide({ confirm: false });
  };

  render() {
    const { formatMessage } = this.props.intl;
    const { children } = this.props;
    return (
      <Dialog
        {...this.props}
        className="ui-dialog-450"
        onHide={this.handleCancel}
        appendTo={document.body}
      >
        <div className="form-body">{children}</div>
        <div className="form-actions">
          <Button
            label={formatMessage(modalButtons.no)}
            icon="fa-close"
            onClick={this.handleCancel}
          />
          <Button
            label={formatMessage(modalButtons.yes)}
            icon="fa-check"
            onClick={this.handleConfirm}
          />
        </div>
      </Dialog>
    );
  }
}

export default injectIntl(ConfirmationDialog);
