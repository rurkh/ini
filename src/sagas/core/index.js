import { fork } from 'redux-saga/effects';
import { watchApiCall } from './api';
import { watchToken } from './token';
import { watchPreloadData } from './preload';

export default function* coreSaga() {
  yield fork(watchApiCall);
  yield fork(watchToken);
  yield fork(watchPreloadData);
}
