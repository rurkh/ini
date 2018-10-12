import React from 'react';
import { injectIntl } from 'react-intl';

const messages = {
  pageTitle: {
    id: 'app.access_denied.page_title',
    defaultMessage: 'Access Denied',
  },
  body: {
    id: 'app.access_denied.body',
    defaultMessage:
      'You are not authorized to access this resource.  Please, use menu at the left side.',
  },
};

const AccessDeniedPage = ({ intl: { formatMessage } }) => {
  return (
    <div className="access-denied-page">
      <h1>{formatMessage(messages.pageTitle)}</h1>
      <p>{formatMessage(messages.body)}</p>
    </div>
  );
};

export default injectIntl(AccessDeniedPage);
