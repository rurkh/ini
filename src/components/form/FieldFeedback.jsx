import React from 'react';
import PropTypes from 'prop-types';
import transMsg from 'utils/transMsg';
import { injectIntl } from 'react-intl';

const FieldFeedback = ({ error, intl }) => {
  const err = typeof error === 'object' ? Object.values(error)[0] : error;
  return err ? (
    <div className="ui-field-error">{intl.formatMessage(transMsg(err))}</div>
  ) : null;
};

FieldFeedback.propTypes = {
  error: PropTypes.string,
  intl: PropTypes.object.isRequired,
};

export default injectIntl(FieldFeedback);
