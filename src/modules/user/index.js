import { createRequestTypes } from 'utils/actionHelpers';
import { typeValidator } from 'utils/typeValidator';
import { createApiCall } from 'utils/api';
import { createSelector } from 'reselect';
import { combineReducers } from 'redux';
import _trim from 'lodash/trim';

const baseName = 'USER';
//region ACTION TYPES
const userTypes = {
  GET_DETAILS: createRequestTypes(`${baseName}_GET_DETAILS`),
  GET_SETTINGS: createRequestTypes(`${baseName}_GET_SETTINGS`),
  CHANGE_SETTINGS: createRequestTypes(`${baseName}_CHANGE_SETTINGS`),
};
export const USER = new Proxy(userTypes, typeValidator);
//endregion

//region ACTIONS
export const getDetails = createApiCall(USER.GET_DETAILS, '/user');
export const getSettings = createApiCall(USER.GET_SETTINGS, '/users/settings');

export const changeStartPage = createApiCall(
  USER.CHANGE_SETTINGS,
  start_screen => ({
    url: '/users/settings',
    method: 'PUT',
    data: { settings: { start_screen } },
  })
);
//endregion

//region REDUCER
const userDetailsReducer = (state = {}, { payload, type }) => {
  switch (type) {
    case USER.GET_DETAILS.SUCCESS:
      return payload;
    case USER.GET_DETAILS.FAILURE:
      return {};
    default:
      return state;
  }
};

const userSettingsReducer = (state = {}, { payload, type }) => {
  switch (type) {
    case USER.GET_SETTINGS.SUCCESS:
      return payload;
    case USER.CHANGE_SETTINGS.SUCCESS:
      return { ...state, ...payload };
    case USER.GET_SETTINGS.FAILURE:
      return {};
    default:
      return state;
  }
};

export default combineReducers({
  details: userDetailsReducer,
  settings: userSettingsReducer,
});
//endregion

//#SELECTORS
const currentUserState = state => state.currentUser;
export const getUserDetails = createSelector(
  currentUserState,
  user => user.details
);
export const getUserName = createSelector(
  getUserDetails,
  details => details.username
);
export const getUserFullName = createSelector(
  getUserDetails,
  details =>
    _trim(`${details.firstname || ''} ${details.lastname || ''}`) ||
    details.username
);
export const getUserPortalAreas = createSelector(getUserDetails, details => {
  return details.portal_areas || [];
});
export const getUserSettings = createSelector(
  currentUserState,
  user => user.settings
);
export const getUserStartPage = createSelector(
  getUserSettings,
  settings => settings.start_screen
);
export const getUserDefaultDistrict = createSelector(
  getUserSettings,
  settings => settings.default_district
);
//endregion
