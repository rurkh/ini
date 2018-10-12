import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import transMsg from 'utils/transMsg';

const ValueItem = ({
  label,
  tagName = 'div',
  className = '',
  children,
  suffix = '',
}) => {
  if (!children) {
    return null;
  }
  return React.createElement(
    tagName,
    { className: classNames('item', className) },
    <Fragment>
      <FormattedMessage {...transMsg(label)}>
        {text => <label className="item--label">{text}: </label>}
      </FormattedMessage>
      {!!children && (
        <span className="item--value">
          {children}
          {!!suffix && <span className="suffix">{suffix}</span>}
        </span>
      )}
    </Fragment>
  );
};

ValueItem.propTypes = {
  label: PropTypes.string.isRequired,
  tagName: PropTypes.element,
  className: PropTypes.string,
  children: PropTypes.node,
};

export default ValueItem;
