import React from 'react';
import { injectIntl } from 'react-intl';

const messages = {
  pageTitle: {
    id: 'app.not_found.page_title',
    defaultMessage: '404 Not Found',
  },
  body: {
    id: 'app.not_found.body',
    defaultMessage:
      'You are requesting page which does not exist. Please, use menu at the left side.',
  },
};

const NotFoundPage = ({ intl: { formatMessage } }) => {
  return (
    <div className="not-found-page">
      <h1>{formatMessage(messages.pageTitle)}</h1>
      <p>{formatMessage(messages.body)}</p>
    </div>
  );
};

export default injectIntl(NotFoundPage);
