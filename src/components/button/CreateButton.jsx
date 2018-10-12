import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import LinkButton from 'components/common/LinkButton';
import { Button } from 'primereact/components/button/Button';
import withTrans from 'components/hoc/withTrans';

const CreateButton = ({
  className = '',
  icon = 'ui-icon-add-circle-outline',
  children,
  trans,
  ...props
}) => {
  const commonProps = {
    className: classNames('ml-5', className),
    icon,
    iconPos: 'left',
  };
  const label = children || trans('app.button.add');

  return props.to ? (
    <LinkButton {...commonProps} {...props}>
      {label}
    </LinkButton>
  ) : (
    <Button {...commonProps} {...props} label={label} />
  );
};

CreateButton.propTypes = {
  icon: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  trans: PropTypes.func.isRequired,
};

export default withTrans(CreateButton);
