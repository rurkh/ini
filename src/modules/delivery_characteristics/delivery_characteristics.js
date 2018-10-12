import { createSelector } from 'reselect';
import { createRequestTypes } from 'utils/actionHelpers';
import { typeValidator } from 'utils/typeValidator';
import { createApiCall } from 'utils/api';

const baseName = 'DELIVERY_CHARACTERISTICS';

// region Action types
const characteristicsTypes = {
  GET: createRequestTypes(`${baseName}_GET`),
  CREATE: createRequestTypes(`${baseName}_CREATE`),
  UPDATE: createRequestTypes(`${baseName}_UPDATE`),
  DELETE: createRequestTypes(`${baseName}_DELETE`),
};

export const CHARACTERISTICS = new Proxy(characteristicsTypes, typeValidator);
// endregion

// region ACTIONS
export const fetchCharacteristics = createApiCall(
  CHARACTERISTICS.GET,
  districtId => ({
    url: `/characteristics?district_id=${districtId}`,
    method: 'GET',
  }),
  districtId => ({ districtId })
);

export const createCharacteristics = createApiCall(
  CHARACTERISTICS.CREATE,
  data => ({
    url: `/characteristics`,
    method: 'POST',
    data,
  })
);

export const updateCharacteristics = createApiCall(
  CHARACTERISTICS.UPDATE,
  (characteristic_id, data) => {
    return {
      url: `/characteristics/${characteristic_id}`,
      method: 'PUT',
      data,
    };
  }
);

export const deleteCharacteristics = createApiCall(
  CHARACTERISTICS.DELETE,
  characteristic_id => ({
    url: `/characteristics/${characteristic_id}`,
    method: 'DELETE',
  }),
  characteristic_id => ({ characteristic_id })
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
    case CHARACTERISTICS.GET.REQUEST:
    case CHARACTERISTICS.CREATE.REQUEST:
    case CHARACTERISTICS.UPDATE.REQUEST:
      return { ...state, isLoading: true };

    case CHARACTERISTICS.GET.SUCCESS:
      return {
        ...state,
        listById: {
          ...state.listById,
          ...payload.reduce((byId, characteristic) => {
            return { ...byId, [characteristic.id]: characteristic };
          }, {}),
        },
        isLoading: false,
      };

    case CHARACTERISTICS.CREATE.SUCCESS:
    case CHARACTERISTICS.UPDATE.SUCCESS:
      return {
        ...state,
        listById: {
          ...state.listById,
          ...{ [payload.id]: payload },
        },
        isLoading: false,
        error: '',
      };

    case CHARACTERISTICS.GET.FAILURE:
    case CHARACTERISTICS.CREATE.FAILURE:
    case CHARACTERISTICS.UPDATE.FAILURE:
      return { ...state, isLoading: false, error: payload };

    case CHARACTERISTICS.DELETE.SUCCESS:
      const {
        [meta.characteristic_id.toString()]: val,
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
const getCharacteristicsState = state => state.characteristics;
export const makeGetCharacteristicsList = () => {
  return createSelector(
    getCharacteristicsState,
    (state, props) => props.districtId,
    (state, districtId) =>
      Object.values(state.listById).filter(
        item => item.district_id === districtId
      )
  );
};
export const isCharacteristicsLoading = createSelector(
  getCharacteristicsState,
  state => state.isLoading
);
export const getCharacteristicsError = createSelector(
  getCharacteristicsState,
  state => state.error
);
//endregion
