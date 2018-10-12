import _last from 'lodash/last';
import _startCase from 'lodash/startCase';

export default (id, message) => ({
  id,
  defaultMessage: message || _startCase(_last(id.split('.'))),
});
