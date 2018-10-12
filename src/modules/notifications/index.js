import { createAction } from 'redux-actions';
import { typeValidator } from 'utils/typeValidator';
import _uniqueId from 'lodash/uniqueId';
import { createSelector } from 'reselect';

// region Action types
const baseName = 'NOTIFICATIONS';
const notificationsTypes = {
  ADD: `${baseName}_ADD`,
  REMOVE: `${baseName}_REMOVE`,
  MARK_AS_SHOWN: `${baseName}_MARK_AS_SHOWN`,
};

export const NOTIFICATIONS = new Proxy(notificationsTypes, typeValidator);
// endregion

//#region ACTIONS
export const addNotification = createAction(NOTIFICATIONS.ADD, message => ({
  message_id: _uniqueId('msg'),
  severity: 'info',
  ...message,
}));
export const removeNotification = createAction(NOTIFICATIONS.REMOVE);
export const markAsShown = createAction(NOTIFICATIONS.MARK_AS_SHOWN);
//#endregion

//#region REDUCER
const initialState = {};
export default (state = initialState, { type, payload }) => {
  switch (type) {
    case NOTIFICATIONS.ADD:
      return { ...state, [payload.message_id]: payload };

    case NOTIFICATIONS.REMOVE:
      const { [payload]: remove, ...other } = state;
      return other;

    case NOTIFICATIONS.MARK_AS_SHOWN:
      return { ...state, [payload]: { ...state[payload], shown: true } };

    default:
      return state;
  }
};

//#region SELECTORS
const getNotificationsState = state => state.notifications;
export const getNotifications = createSelector(
  getNotificationsState,
  notifications => Object.values(notifications).filter(n => !n.shown)
);
//#endregion
