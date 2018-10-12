import _snakeCase from 'lodash/snakeCase';
import _kebabCase from 'lodash/kebabCase';
import _uniq from 'lodash/uniq';

import { createRequestTypes } from 'utils/actionHelpers';
import { typeValidator } from 'utils/typeValidator';
import { createApiCall } from 'utils/api';
import { DISTRICTS } from 'modules/districts/districts';
import { USERS } from 'modules/users/users';

export const autocompleteTypes = [
  'districts',
  'depositions',
  'users',
  'meansOfTransportation',
  'tags',
];

//region ACTION TYPES
const enumActionTypes = {};
for (let enumType of autocompleteTypes) {
  const base = _snakeCase(enumType).toUpperCase();
  enumActionTypes[base] = createRequestTypes(`GET_${base}`);
}
enumActionTypes.USER_ROLES = createRequestTypes(`GET_USER_ROLES`);
export const ENUMS = new Proxy(enumActionTypes, typeValidator);
//endregion

//region ACTIONS
export const createEnumAction = group => {
  const actionCreator =
    group === 'roles'
      ? createApiCall(ENUMS.USER_ROLES, `/users/roles`)
      : createApiCall(
          ENUMS[_snakeCase(group).toUpperCase()],
          `/autocomplete/${_kebabCase(group)}`
        );

  return actionCreator();
};
//endregion

//region REDUCER
const defaultState = {};
export default (state = defaultState, { type, payload }) => {
  switch (type) {
    case ENUMS.MEANS_OF_TRANSPORTATION.SUCCESS:
      return { ...state, meansOfTransportation: payload };

    case DISTRICTS.CREATE.SUCCESS:
    case DISTRICTS.UPDATE.SUCCESS:
      return {
        ...state,
        meansOfTransportation: _uniq([
          ...state.meansOfTransportation,
          payload.means_of_transportation,
        ]),
      };

    case ENUMS.TAGS.SUCCESS:
      return { ...state, tags: payload };

    case USERS.CREATE_USER.SUCCESS:
    case USERS.UPDATE_USER.SUCCESS:
      return {
        ...state,
        tags: _uniq([...state.tags, ...payload.tags]),
      };

    case ENUMS.USER_ROLES.SUCCESS:
      return { ...state, roles: payload };

    default:
      return state;
  }
};
//endregion

//region SELECTORS
const getEnumState = state => state.app.enum;

export const getTags = state => getEnumState(state).tags || [];
export const getTagsOptions = state =>
  getTags(state).map(value => ({ label: value, value }));

export const getMeansOfTransportation = state =>
  getEnumState(state).meansOfTransportation || [];
export const getMeansOfTransportationOptions = state =>
  getMeansOfTransportation(state).map(name => ({
    value: name,
    label: name,
  }));

export const getRoles = state => getEnumState(state).roles || [];
export const getRolesOptions = state =>
  getRoles(state).map(value => ({ label: value, value }));

//endregion
