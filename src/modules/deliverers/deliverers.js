import { createSelector } from 'reselect';
import { createRequestTypes } from 'utils/actionHelpers';
import { typeValidator } from 'utils/typeValidator';
import { createApiCall } from 'utils/api';
import _omit from 'lodash/omit';
import compareDates from 'date-fns/compare_asc';
import endOfDay from 'date-fns/end_of_day';
import isWithinRange from 'date-fns/is_within_range';

import schema from './schema';

const baseName = 'DELIVERERS';

// region Action types
const deliverersTypes = {
  GET_ALL: createRequestTypes(`${baseName}_GET_ALL`),
  UPDATE_TIME: createRequestTypes(`${baseName}_UPDATE_TIME`),
  DELETE_ASSIGNMENT: createRequestTypes(`${baseName}_DELETE_ASSIGNMENT`),
  SET_TIME: createRequestTypes(`${baseName}_SET_TIME`),
};

export const DELIVERERS = new Proxy(deliverersTypes, typeValidator);
// endregion

// region ACTIONS
export const fetchDeliverers = createApiCall(
  DELIVERERS.GET_ALL,
  districtId => ({ url: `/deliverers/${districtId}` }),
  districtId => ({ districtId })
);
export const updateDelivererTime = createApiCall(
  DELIVERERS.UPDATE_TIME,
  (id, data) => ({
    url: `/deliverers/${id}`,
    data,
    method: 'PUT',
  })
);
export const setDelivererTime = createApiCall(
  DELIVERERS.SET_TIME,
  (id, data) => ({
    url: `/deliverers/${id}`,
    data,
    method: 'POST',
  })
);
export const deleteAssignment = createApiCall(
  DELIVERERS.DELETE_ASSIGNMENT,
  assignmentId => ({
    url: `/deliverers/${assignmentId}`,
    method: 'DELETE',
  }),
  assignmentId => ({ assignmentId })
);
// end region

//region REDUCER
const cast = deliverer => schema.cast(deliverer, { context: { mode: 'list' } });
const initialState = {
  isLoading: false,
  error: '',
  listById: {},
};
export default function(state = initialState, { type, payload, meta }) {
  switch (type) {
    case DELIVERERS.GET_ALL.REQUEST:
      return {
        ...state,
        isLoading: true,
        error: '',
      };
    case DELIVERERS.GET_ALL.SUCCESS:
      return {
        ...state,
        listById: {
          ...state.listById,
          ...payload.reduce((byId, deliverer) => {
            return { ...byId, [deliverer.id]: cast(deliverer) };
          }, {}),
        },
        isLoading: false,
      };

    case DELIVERERS.DELETE_ASSIGNMENT.SUCCESS:
      return {
        ...state,
        listById: _omit(state.listById, meta.assignmentId),
      };
    case DELIVERERS.SET_TIME.SUCCESS:
    case DELIVERERS.UPDATE_TIME.SUCCESS:
      return {
        ...state,
        listById: {
          ...state.listById,
          [payload.id]: {
            ...state.listById[payload.id],
            ...cast(payload),
          },
        },
      };
    case DELIVERERS.GET_ALL.FAILURE:
      return { ...state, isLoading: false, error: payload };
    default:
      return state;
  }
}
// end region

//#SELECTORS
const getDeliverersState = state => state.deliverers;
export const makeGetDeliverersList = () => {
  return createSelector(
    getDeliverersState,
    (state, props) => props.districtId,
    (state, districtId) =>
      Object.values(state.listById)
        .filter(item => item.district_id === districtId)
        .map(item => {
          const { start_date, end_date } = item;
          item.active =
            compareDates(start_date, Date.now()) !== 1 &&
            isWithinRange(
              Date.now(),
              start_date,
              endOfDay(end_date || Date.now())
            );
          return item;
        })
  );
};
export const isDeliverersLoading = createSelector(
  getDeliverersState,
  state => state.isLoading
);
export const getDeliverersError = createSelector(
  getDeliverersState,
  state => state.error
);
//endregion
