import _findIndex from 'lodash/findIndex';

export const filterArrayOfValues = (value, filter) => {
  if (filter === undefined || filter === null || filter.length === 0) {
    return true;
  }

  if (value === undefined || value === null) {
    return false;
  }

  for (let i = 0; i < filter.length; i++) {
    if (value.indexOf(filter[i]) !== -1) {
      return true;
    }
  }

  return false;
};

export const filterByDistricts = (value, filter) => {
  if (filter === undefined || filter === null || filter.length === 0) {
    return true;
  }

  if (value === undefined || value === null) {
    return false;
  }

  for (let i = 0; i < filter.length; i++) {
    if (_findIndex(value, ['id', filter[i]]) !== -1) {
      return true;
    }
  }

  return false;
};
