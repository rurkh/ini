import { createSelector } from 'reselect';
import _filter from 'lodash/filter';
import _mapValues from 'lodash/mapValues';
import _reject from 'lodash/reject';
import { createRequestTypes } from 'utils/actionHelpers';
import { typeValidator } from 'utils/typeValidator';
import { createApiCall } from 'utils/api';
import { ENUMS } from 'modules/core/enum';
import { DISTRICTS } from 'modules/districts/districts';
import userSchema from './schema';

const baseName = 'USERS';
//region ACTION TYPES
const usersTypes = {
  GET_USERS: createRequestTypes(`${baseName}_GET_USERS`),
  CREATE_USER: createRequestTypes(`${baseName}_CREATE_USER`),
  UPDATE_USER: createRequestTypes(`${baseName}_UPDATE_USER`),
  DELETE: createRequestTypes(`${baseName}_DELETE`),
};
export const USERS = new Proxy(usersTypes, typeValidator);
//endregion

//region ACTIONS
export const fetchUsers = createApiCall(USERS.GET_USERS, params => ({
  url: '/users',
  params,
}));
export const createUser = createApiCall(USERS.CREATE_USER, data => ({
  url: `/users/signup`,
  method: 'POST',
  data,
}));
export const updateUser = createApiCall(
  USERS.UPDATE_USER,
  ({ username, ...data }) => ({
    url: `/users/${username}`,
    method: 'PUT',
    data,
  })
);

export const deleteUser = createApiCall(
  USERS.DELETE,
  ({ username }) => ({
    url: `/users/${username}`,
    method: 'DELETE',
  }),
  ({ username }) => ({ username })
);
//endregion

//region REDUCER
const transformUser = user =>
  userSchema.cast(user, {
    context: { mode: 'list' },
  });

const initialState = {
  isLoading: false,
  error: '',
  listById: {},
};
export default function(state = initialState, { type, payload, meta }) {
  switch (type) {
    case USERS.GET_USERS.REQUEST:
    case USERS.CREATE_USER.REQUEST:
    case USERS.UPDATE_USER.REQUEST:
      return { ...state, isLoading: true };

    case ENUMS.USERS.SUCCESS:
    case USERS.GET_USERS.SUCCESS:
      return {
        ...state,
        listById: {
          ...state.listById,
          ...payload.reduce((byId, user) => {
            return {
              ...byId,
              [user.username]: transformUser(user),
            };
          }, {}),
        },
        isLoading: false,
        error: '',
      };

    case USERS.CREATE_USER.SUCCESS:
    case USERS.UPDATE_USER.SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: '',
        listById: {
          ...state.listById,
          [payload.username]: transformUser(payload),
        },
      };

    case USERS.GET_USERS.FAILURE:
    case USERS.CREATE_USER.FAILURE:
    case USERS.UPDATE_USER.FAILURE:
      return { ...state, isLoading: false, error: payload.message };

    case USERS.DELETE.SUCCESS: {
      const { [`${meta.username}`]: val, ...listById } = state.listById;
      return {
        ...state,
        listById,
      };
    }

    case DISTRICTS.DELETE.SUCCESS: {
      return {
        ...state,
        listById: _mapValues(state.listById, user => ({
          ...user,
          districts: _reject(user.districts, ['id', meta.districtId]),
        })),
      };
    }

    default:
      return state;
  }
}
//endregion

//#SELECTORS
const getUsersState = state => state.users;
export const getUsersList = createSelector(getUsersState, ({ listById }) =>
  Object.values(listById).map(({ representations = [], ...user }) => ({
    ...user,
    representations: representations.map(username => listById[username] || {}),
  }))
);

export const makeGetUsersListByRole = role => {
  return createSelector(getUsersList, list =>
    _filter(list, user => user.user_roles.includes(role))
  );
};
export const makeGetUsersByRoleNameProp = () => {
  return createSelector(
    getUsersList,
    (_, props) => props.roleName,
    (users, roleName) =>
      roleName ? users.filter(u => u.user_roles.includes(roleName)) : users
  );
};
export const isUsersLoading = createSelector(
  getUsersState,
  state => state.isLoading
);
export const getUsersError = createSelector(
  getUsersState,
  state => state.error
);
//endregion
