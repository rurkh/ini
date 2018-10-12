import { call, take, all, put, race } from 'redux-saga/effects';
import _snakeCase from 'lodash/snakeCase';

import { getDetails, getSettings, USER } from 'modules/user';
import { APP } from 'modules/core/app';
import { AUTH } from 'modules/auth';
import { ENUMS, autocompleteTypes, createEnumAction } from 'modules/core/enum';

function* preloadData() {
  yield all(
    [
      put(getDetails()),
      put(getSettings()),
      put(createEnumAction('roles')),
    ].concat(
      autocompleteTypes.map(enumType => {
        return put(createEnumAction(enumType));
      })
    )
  );

  yield all(
    [
      take([USER.GET_DETAILS.SUCCESS, USER.GET_DETAILS.FAILURE]),
      take([USER.GET_SETTINGS.SUCCESS, USER.GET_SETTINGS.FAILURE]),
      take([ENUMS.USER_ROLES.SUCCESS, ENUMS.USER_ROLES.FAILURE]),
    ].concat(
      autocompleteTypes.map(enumType => {
        const base = _snakeCase(enumType).toUpperCase();
        return take([ENUMS[base].SUCCESS, ENUMS[base].FAILURE]);
      })
    )
  );

  return true;
}

export function* watchPreloadData() {
  while (true) {
    yield take(APP.PRELOAD);

    const { preload } = yield race({
      preload: call(preloadData),
      signout: take(AUTH.SIGN_OUT),
    });

    if (preload) {
      yield put({ type: APP.PRELOAD_FINISHED });
    }
  }
}
