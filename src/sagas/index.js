import { all, cancel, fork, take } from 'redux-saga/effects';
import { APP } from 'modules/core/app';
import core from './core';
import messages from './messages';

export default function* root() {
  while (true) {
    yield take(APP.START);

    const tasks = yield all([fork(core), fork(messages)]);

    yield take(APP.SHUTDOWN);
    yield cancel(...tasks);
  }
}
