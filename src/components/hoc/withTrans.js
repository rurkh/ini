import { injectIntl } from 'react-intl';
import { compose, withHandlers } from 'recompose';

import transMsg from 'utils/transMsg';

const withTrans = compose(
  injectIntl,
  withHandlers({
    trans: ({ intl }) => (key, msg, values) => {
      // Check if the string is not a key (contains spaces) — just return it.
      return /\s/.test(key)
        ? key
        : intl.formatMessage(transMsg(key, msg), values);
    },
  })
);

export default withTrans;
