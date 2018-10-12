import { createSelector } from 'reselect';
import { createRequestTypes } from 'utils/actionHelpers';
import { typeValidator } from 'utils/typeValidator';
import { createApiCall } from 'utils/api';

const baseName = 'RECLAMATION';

// region Action types
const reclamationsTypes = {
  GET: createRequestTypes(`${baseName}_GET`),
  CREATE: createRequestTypes(`${baseName}_CREATE`),
  UPDATE: createRequestTypes(`${baseName}_UPDATE`),
  DELETE: createRequestTypes(`${baseName}_DELETE`),
};

export const RECLAMATION = new Proxy(reclamationsTypes, typeValidator);
// endregion

// region ACTIONS
export const fetchReclamations = createApiCall(
  RECLAMATION.GET,
  districtId => ({
    url: `/reclamations?district_id=${districtId}`,
    method: 'GET',
  }),
  districtId => ({ districtId })
);

export const createReclamation = createApiCall(RECLAMATION.CREATE, data => ({
  url: `/reclamations`,
  method: 'POST',
  data,
}));

export const updateReclamation = createApiCall(
  RECLAMATION.UPDATE,
  (reclamation_id, data) => ({
    url: `/reclamations/${reclamation_id}`,
    method: 'PUT',
    data,
  })
);

export const deleteReclamation = createApiCall(
  RECLAMATION.DELETE,
  reclamation_id => ({
    url: `/reclamations/${reclamation_id}`,
    method: 'DELETE',
  }),
  reclamation_id => ({ reclamation_id })
);
// end region

//region REDUCER
const initialState = {
  isLoading: false,
  error: '',
  listById: {},
};
export default function(state = initialState, { type, payload, meta }) {
  switch (type) {
    case RECLAMATION.GET.REQUEST:
    case RECLAMATION.CREATE.REQUEST:
    case RECLAMATION.UPDATE.REQUEST:
      return { ...state, isLoading: true };

    case RECLAMATION.GET.SUCCESS:
      return {
        ...state,
        listById: {
          ...state.listById,
          ...payload.reduce((byId, reclamation) => {
            return { ...byId, [reclamation.id]: reclamation };
          }, {}),
        },
        isLoading: false,
      };

    case RECLAMATION.CREATE.SUCCESS:
    case RECLAMATION.UPDATE.SUCCESS:
      return {
        ...state,
        listById: {
          ...state.listById,
          ...{ [payload.id]: payload },
        },
        isLoading: false,
        error: '',
      };

    case RECLAMATION.GET.FAILURE:
    case RECLAMATION.CREATE.FAILURE:
    case RECLAMATION.UPDATE.FAILURE:
      return { ...state, isLoading: false, error: payload };

    case RECLAMATION.DELETE.SUCCESS:
      const {
        [meta.reclamation_id.toString()]: val,
        ...listById
      } = state.listById;
      return {
        ...state,
        listById,
      };

    default:
      return state;
  }
}
// end region

//#SELECTORS
const getReclamationsState = state => state.reclamations;
export const makeGetReclamationsList = () => {
  return createSelector(
    getReclamationsState,
    (state, props) => props.districtId,
    (state, districtId) =>
      Object.values(state.listById).filter(
        item => item.district_id === districtId
      )
  );
};
export const isReclamationsLoading = createSelector(
  getReclamationsState,
  state => state.isLoading
);
export const getReclamationsError = createSelector(
  getReclamationsState,
  state => state.error
);
//endregion
