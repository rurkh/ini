import { createSelector } from 'reselect';
import { createRequestTypes } from 'utils/actionHelpers';
import { typeValidator } from 'utils/typeValidator';
import { createApiCall } from 'utils/api';
import { ENUMS } from 'modules/core/enum';
import depositionSchema from './schema';

const baseName = 'DEPOSITIONS';

// region Action types
const depositionTypes = {
  GET_ALL: createRequestTypes(`${baseName}_GET_ALL`),
  CREATE: createRequestTypes(`${baseName}_CREATE`),
  UPDATE: createRequestTypes(`${baseName}_UPDATE`),
  DELETE: createRequestTypes(`${baseName}_DELETE`),
};

export const DEPOSITIONS = new Proxy(depositionTypes, typeValidator);
// endregion

// region ACTIONS
export const fetchDepositions = createApiCall(
  DEPOSITIONS.GET_ALL,
  '/depositions'
);
export const createDeposition = createApiCall(DEPOSITIONS.CREATE, data => ({
  url: `/depositions`,
  method: 'POST',
  data,
}));
export const updateDeposition = createApiCall(
  DEPOSITIONS.UPDATE,
  ({ id, ...data }) => ({
    url: `/depositions/${id}`,
    method: 'PUT',
    data,
  })
);
export const deleteDeposition = createApiCall(
  DEPOSITIONS.DELETE,
  ({ id }) => ({
    url: `/depositions/${id}`,
    method: 'DELETE',
  }),
  ({ id }) => ({ depositionId: id })
);
// end region

//region REDUCER
const transformDeposition = deposition =>
  depositionSchema.cast(deposition, { context: { mode: 'list' } });
const initialState = {
  isLoading: false,
  error: '',
  listById: {},
};
export default function(state = initialState, { type, payload, meta }) {
  switch (type) {
    case DEPOSITIONS.GET_ALL.REQUEST:
    case DEPOSITIONS.CREATE.REQUEST:
    case DEPOSITIONS.UPDATE.REQUEST:
      return { ...state, isLoading: true };

    case DEPOSITIONS.GET_ALL.SUCCESS:
    case ENUMS.DEPOSITIONS.SUCCESS:
      return {
        ...state,
        listById: {
          ...state.listById,
          ...payload.reduce((byId, deposition) => {
            return {
              ...byId,
              [deposition.id]: transformDeposition(deposition),
            };
          }, {}),
        },
        isLoading: false,
      };

    case DEPOSITIONS.CREATE.SUCCESS:
    case DEPOSITIONS.UPDATE.SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: '',
        listById: {
          ...state.listById,
          ...{ [payload.id]: transformDeposition(payload) },
        },
      };
    case DEPOSITIONS.DELETE.SUCCESS:
      const { [`${meta.depositionId}`]: val, ...listById } = state.listById;
      return {
        ...state,
        listById,
      };

    case DEPOSITIONS.GET_ALL.FAILURE:
    case DEPOSITIONS.CREATE.FAILURE:
    case DEPOSITIONS.UPDATE.FAILURE:
      return { ...state, isLoading: false, error: payload };

    default:
      return state;
  }
}
// end region

//#SELECTORS
const getDepositionsState = state => state.depositions;
export const getDepositionsList = createSelector(getDepositionsState, state =>
  Object.values(state.listById)
);
export const getDepositionsOptions = createSelector(
  getDepositionsList,
  depositions =>
    depositions.map(({ id, name }) => ({
      value: id,
      label: `${id}: ${name}`,
    }))
);
export const isDepositionsLoading = createSelector(
  getDepositionsState,
  state => state.isLoading
);
export const getDepositionsError = createSelector(
  getDepositionsState,
  state => state.error
);
//endregion
