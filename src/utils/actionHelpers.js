const REQUEST = 'REQUEST';
const SUCCESS = 'SUCCESS';
const FAILURE = 'FAILURE';

export function createRequestTypes(base, extend = {}) {
  const res = extend;
  [REQUEST, SUCCESS, FAILURE].forEach(type => {
    res[type] = `${base}_${type}`;
  });

  return res;
}
