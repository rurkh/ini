import _isEmpty from 'lodash/isEmpty';

export const typeValidator = {
  get(obj, prop) {
    if (obj[prop]) {
      return _isEmpty(obj[prop]) ? prop : obj[prop];
    } else {
      throw new TypeError(`${prop} is not a valid action type`);
    }
  },
};
