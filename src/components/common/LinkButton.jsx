import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

class LinkButton extends PureComponent {
  static defaultProps = {
    icon: null,
    iconPos: 'left',
    cornerStyleClass: 'ui-corner-all',
  };

  static propTypes = {
    to: PropTypes.string.isRequired,
    icon: PropTypes.string,
    iconPos: PropTypes.string,
    cornerStyleClass: PropTypes.string,
    children: PropTypes.any,
  };

  renderIcon() {
    if (this.props.icon) {
      let className = classNames(
        this.props.icon,
        'ui-button-icon ui-c fa fa-fw',
        {
          'ui-button-icon-left': this.props.iconPos !== 'right',
          'ui-button-icon-right': this.props.iconPos === 'right',
        }
      );

      return <span className={className} />;
    } else {
      return null;
    }
  }

  renderLabel() {
    if (this.props.children) {
      return <span className="ui-button-text ui-c">{this.props.children}</span>;
    } else {
      return null;
    }
  }

  render() {
    const {
      iconPos,
      icon,
      cornerStyleClass,
      className,
      ...linkProps
    } = this.props;

    const linkClassName = classNames(
      'ui-button ui-widget ui-state-default',
      cornerStyleClass,
      className,
      {
        'ui-button-icon-only': this.props.icon && !this.props.children,
        'ui-state-disabled': this.props.disabled,
      }
    );

    return (
      <Link {...linkProps} className={linkClassName}>
        {this.props.iconPos === 'left' && this.renderIcon()}
        {this.renderLabel()}
        {this.props.iconPos === 'right' && this.renderIcon()}
      </Link>
    );
  }
}

export default LinkButton;
