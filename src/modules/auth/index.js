import { createRequestTypes } from 'utils/actionHelpers';
import { typeValidator } from 'utils/typeValidator';
import { createAction } from 'redux-actions';
import { createApiCall } from 'utils/api';

//region ACTION TYPES
const tokenTypes = {
  SIGN_IN: createRequestTypes('SIGN_IN'),
  SIGN_OUT: 'SIGN_OUT',
  UPDATE_TOKEN: 'UPDATE_TOKEN',
};
export const AUTH = new Proxy(tokenTypes, typeValidator);
//endregion

//region ACTIONS
export const signIn = createApiCall(AUTH.SIGN_IN, (username, password) => ({
  url: '/users/login',
  method: 'POST',
  data: { username, password },
  anon: true,
}));

export const signOut = createAction(AUTH.SIGN_OUT);
export const updateAccessToken = createAction(AUTH.UPDATE_TOKEN);
//endregion

//region REDUCER
const initialState = {
  accessToken: localStorage.getItem('iniTrackAccessToken') || '',
  refreshToken: localStorage.getItem('iniTrackRefreshToken') || '',
  tokenErrorMessage: '',
};

export default function(state = initialState, { payload, type }) {
  switch (type) {
    case AUTH.SIGN_IN.SUCCESS:
      return {
        accessToken: payload.access_token,
        refreshToken: payload.refresh_token,
        authError: '',
      };
    case AUTH.SIGN_IN.FAILURE:
      return {
        ...state,
        authError: payload.message,
      };
    case AUTH.SIGN_OUT:
      return {
        refreshToken: '',
        accessToken: '',
        authError: '',
      };
    case AUTH.UPDATE_TOKEN:
      return {
        ...state,
        accessToken: payload,
      };
    default:
      return state;
  }
}
//endregion

//#SELECTORS
export const getAuthTokens = state => state.auth;
export const getAccessToken = state => getAuthTokens(state).accessToken;
export const getRefreshToken = state => getAuthTokens(state).refreshToken;
export const getAuthErrors = state => getAuthTokens(state).authError;
export const isAuthenticated = state => !!getAccessToken(state);
//endregion
