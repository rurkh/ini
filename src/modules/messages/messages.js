import { createSelector } from 'reselect';
import { createRequestTypes } from 'utils/actionHelpers';
import { typeValidator } from 'utils/typeValidator';
import { createApiCall } from 'utils/api';
import startOfDay from 'date-fns/start_of_day';
import endOfDay from 'date-fns/end_of_day';
import isWithinRange from 'date-fns/is_within_range';

const baseName = 'MESSAGES';

// region Action types
const messagesTypes = {
  GET: createRequestTypes(`${baseName}_GET`),
  UNREAD_COUNT: createRequestTypes(`${baseName}_GET_UNREAD_COUNT`),
};

export const MESSAGES = new Proxy(messagesTypes, typeValidator);
// endregion

// region ACTIONS
export const fetchMessages = createApiCall(
  MESSAGES.GET,
  (category, date_from, date_to) => ({
    url: `/messages/${category}`,
    method: 'GET',
    params: {
      date_from,
      date_to,
    },
  }),
  category => ({ category })
);
export const fetchUnreadCount = createApiCall(
  MESSAGES.UNREAD_COUNT,
  '/messages/unread'
);
// end region

//region REDUCER
const initialState = {
  isLoading: false,
  unread: 0,
  error: '',
  listById: {},
};
export default function(state = initialState, { type, payload, meta }) {
  switch (type) {
    case MESSAGES.GET.REQUEST:
      return { ...state, isLoading: true };

    case MESSAGES.GET.SUCCESS:
      return {
        ...state,
        listById: {
          ...state.listById,
          ...payload.reduce((byId, message) => {
            return { ...byId, [message.id]: { ...message, ...meta } };
          }, {}),
        },
        isLoading: false,
      };

    case MESSAGES.UNREAD_COUNT.SUCCESS:
      return {
        ...state,
        unread: payload.unread_messages,
        isLoading: false,
        error: '',
      };

    case MESSAGES.GET.FAILURE:
      return { ...state, isLoading: false, error: payload };

    default:
      return state;
  }
}
// end region

//#SELECTORS
const getMessagesState = state => state.messages;
const getMessagesListItems = createSelector(getMessagesState, state =>
  Object.values(state.listById)
);
export const getMessagesList = createSelector(
  getMessagesListItems,
  (state, props) => props.category,
  (state, props) => props.date_from,
  (state, props) => props.date_to,
  (messages, category, date_from, date_to) =>
    messages.filter(
      item =>
        item.category === category &&
        isWithinRange(item.created_at, startOfDay(date_from), endOfDay(date_to))
    )
);
export const isMessagesLoading = createSelector(
  getMessagesState,
  state => state.isLoading
);
export const getMessagesError = createSelector(
  getMessagesState,
  state => state.error
);
export const getUnreadCount = createSelector(
  getMessagesState,
  state => state.unread
);
//endregion
