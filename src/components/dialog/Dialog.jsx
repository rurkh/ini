import React, { Component } from 'react';
import { Dialog as PrimeDialog } from 'primereact/components/dialog/Dialog';

class Dialog extends Component {
  static bodyClassName = 'ui-dialog-open';

  getScrollbarWidth = () => {
    const scrollDiv = document.createElement('div');
    scrollDiv.className = 'modal-scrollbar-measure';
    document.body.appendChild(scrollDiv);
    const scrollbarWidth =
      scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);

    const bodyOverflowing =
      document.body.getBoundingClientRect().width !== window.innerWidth;
    if (bodyOverflowing) {
      return scrollbarWidth;
    }
  };

  setPaddingRight = paddingRight => {
    document.body.style.paddingRight = paddingRight;
    document.querySelector('.topbar').style.paddingRight = paddingRight;
  };

  onShow = () => {
    this.setPaddingRight(this.getScrollbarWidth() + 'px');
    document.body.classList.add(Dialog.bodyClassName);
    this.props.onShow && this.props.onShow();
  };

  onHide = () => {
    this.setPaddingRight('');
    document.body.classList.remove(Dialog.bodyClassName);
    this.props.onHide && this.props.onHide();
  };

  componentWillUnmount() {
    this.setPaddingRight('');
    document.body.classList.remove(Dialog.bodyClassName);
  }

  render() {
    const { onShow, onHide, ...props } = this.props;
    return <PrimeDialog {...props} onShow={this.onShow} onHide={this.onHide} />;
  }
}

export default Dialog;
