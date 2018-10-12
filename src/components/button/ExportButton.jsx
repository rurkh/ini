import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button } from 'primereact/components/button/Button';
import withTrans from 'components/hoc/withTrans';

const ExportButton = ({ className = '', children, trans, ...props }) => (
  <Button
    type="button"
    className={classNames('btn-outline', className)}
    icon="ui-icon-file-download"
    iconPos="left"
    label={children || trans('app.button.export')}
    {...props}
  />
);

ExportButton.propTypes = {
  icon: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  trans: PropTypes.func.isRequired,
};

export default withTrans(ExportButton);
