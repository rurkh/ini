import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'primereact/components/button/Button';
import ConfirmationDialog from 'components/dialog/ConfirmationDialog';

export default class ConfirmButton extends PureComponent {
  static propTypes = {
    confirmDialogHeader: PropTypes.string,
    confirmDialogContent: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func,
    ]),
    onConfirm: PropTypes.func,
  };

  static defaultProps = {
    type: 'button',
  };

  state = {
    visible: false,
  };

  onHide = ({ confirm }) => {
    const { entity } = this.props;
    this.setState({ visible: false });
    confirm && this.props.onConfirm(entity);
  };

  showConfirm = () => {
    this.setState({ visible: true });
  };

  renderDialog() {
    const { confirmDialogHeader, confirmDialogContent } = this.props;
    const content =
      typeof confirmDialogContent === 'function'
        ? confirmDialogContent()
        : confirmDialogContent;

    return (
      <ConfirmationDialog
        modal
        draggable={false}
        header={confirmDialogHeader}
        visible
        onHide={this.onHide}
      >
        {content}
      </ConfirmationDialog>
    );
  }

  render() {
    const {
      confirmDialogHeader,
      confirmDialogContent,
      onConfirm,
      children,
      ...props
    } = this.props;
    const { visible } = this.state;

    return (
      <Fragment>
        <Button {...props} onClick={this.showConfirm}>
          {children}
        </Button>
        {visible && this.renderDialog()}
      </Fragment>
    );
  }
}
