import {
  actionChannel,
  call,
  select,
  take,
  put,
  race,
  flush,
} from 'redux-saga/effects';
import {
  AUTH,
  getAccessToken,
  getRefreshToken,
  updateAccessToken,
  signOut,
} from 'modules/auth';
import { API, apiClient } from 'utils/api';

function* request({ anon, ...options }) {
  options.data = options.data || {};
  options.headers = options.headers || {};

  // add auth header if required.
  if (!anon && !options.headers.Authorization) {
    const token = yield select(getAccessToken);
    options.headers.Authorization = `Bearer ${token}`;
  }

  return yield apiClient
    .request(options)
    .then(response => [response.data.data || {}])
    .catch(error => [false, error.response.data]);
}

/**
 * Generates and handles api call in generic way.
 */
function* apiCall(options, { actions, ...meta } = {}) {
  if (actions && actions.REQUEST) {
    yield put({ type: actions.REQUEST, payload: options });
  }

  while (true) {
    const [payload, error = {}] = yield request(options);

    if (payload) {
      if (actions && actions.SUCCESS) {
        yield put({ type: actions.SUCCESS, payload, meta });
      }
      break;
    } else if (options.anon || error.status !== 401) {
      if (actions && actions.FAILURE) {
        yield put({ type: actions.FAILURE, payload: error, meta });
      }
      break;
    }

    const refreshToken = yield select(getRefreshToken);
    const [refreshTokenPayload] = yield request({
      url: '/users/token/refresh',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    if (!refreshTokenPayload) {
      yield put(signOut());
      break;
    }

    yield put.resolve(updateAccessToken(refreshTokenPayload.access_token));
  }
}

/**
 * Main Saga to track all api calls.
 */
export function* watchApiCall() {
  // handle all API.CALL like a queue.
  const apiCallsChannel = yield actionChannel(API.CALL);

  while (true) {
    const { payload, meta } = yield take(apiCallsChannel);

    const { signout } = yield race({
      response: call(apiCall, payload, meta),
      signout: take(AUTH.SIGN_OUT),
    });

    if (signout) {
      yield flush(apiCallsChannel);
    }
  }
}
