import { takeEvery, select, put } from 'redux-saga/effects';
import { AUTH, getAuthTokens } from 'modules/auth';
import { push } from 'react-router-redux';

function* saveToken() {
  const { accessToken, refreshToken } = yield select(getAuthTokens);

  localStorage.setItem('iniTrackAccessToken', accessToken);
  localStorage.setItem('iniTrackRefreshToken', refreshToken);
}

function* removeToken() {
  localStorage.removeItem('iniTrackAccessToken');
  localStorage.removeItem('iniTrackRefreshToken');
  yield put(push('/'));
}

export function* watchToken() {
  yield takeEvery(AUTH.SIGN_IN.SUCCESS, saveToken);
  yield takeEvery(AUTH.SIGN_OUT, removeToken);
}
