import axios from 'axios';
import { createAction } from 'redux-actions';
import { typeValidator } from './typeValidator';

const apiTypes = {
  CALL: 'API_CALL',
  READ: 'GET',
  UPDATE: 'PUT',
  DELETE: 'DELETE',
  CREATE: 'POST',
};

export const API = new Proxy(apiTypes, typeValidator);

/**
 * Generic helper to create payload for the api request action.
 *
 * @param {Array} apiActions Set of request actions to dispatch after api call.
 * @param {object} options Parameter for axios.
 * @param {object} meta (optional)
 */
export const createApiCall = (apiActions, optionsCb, meta = {}) => {
  return createAction(
    API.CALL,
    (...params) => {
      switch (typeof optionsCb) {
        case 'function':
          return optionsCb(...params);
        case 'string':
          return { url: optionsCb };
        default:
          return optionsCb;
      }
    },
    (...params) => ({
      ...(typeof meta === 'function' ? meta(...params) : meta),
      actions: apiActions,
    })
  );
};

// Configure axios client.
export const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});
apiClient.defaults.headers.common['Content-Type'] = 'application/json';
