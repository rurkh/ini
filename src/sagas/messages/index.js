import { cancel, fork, take, select, put } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import startOfDay from 'date-fns/start_of_day';
import endOfDay from 'date-fns/end_of_day';
import format from 'date-fns/format';

import { USER, getUserPortalAreas } from 'modules/user';
import { AUTH } from 'modules/auth';
import {
  MESSAGES,
  fetchUnreadCount,
  getUnreadCount,
  fetchMessages,
} from 'modules/messages/messages';
import { addNotification } from 'modules/notifications';

const pollingInterval = (process.env.REACT_APP_POLLING_INTERVAL || 30) * 1000;

function* watchNewMessagesCount() {
  let unread = 0;
  while (true) {
    yield put(fetchUnreadCount());

    yield take([MESSAGES.UNREAD_COUNT.SUCCESS, MESSAGES.UNREAD_COUNT.FAILURE]);

    // Check if unread count changed — fetch new messages.
    const newUnread = yield select(getUnreadCount);
    if (newUnread > unread) {
      yield put(
        fetchMessages(
          'inbox',
          format(startOfDay(Date.now()), 'YYYY-MM-DD'),
          format(endOfDay(Date.now()), 'YYYY-MM-DD')
        )
      );
      yield put(
        addNotification({
          summary: 'app.notifications.new_messages.summary',
          detail: 'app.notifications.new_messages.detail',
          values: { count: newUnread - unread },
          link: '/messages',
        })
      );

      unread = newUnread;
    }

    yield delay(pollingInterval);
  }
}

export default function* messagesSaga() {
  while (true) {
    yield take(USER.GET_DETAILS.SUCCESS);
    let portalAreas = yield select(getUserPortalAreas);
    if (!portalAreas.includes('messages')) {
      continue;
    }

    const watcher = yield fork(watchNewMessagesCount);

    yield take(AUTH.SIGN_OUT);
    yield cancel(watcher);
  }
}
