import { createSelector } from 'reselect';
import { createRequestTypes } from 'utils/actionHelpers';
import { typeValidator } from 'utils/typeValidator';
import { createApiCall } from 'utils/api';
import { ENUMS } from 'modules/core/enum';
import districtSchema from './schema';

const baseName = 'DISTRICTS';

// region Action types
const districtTypes = {
  GET_ALL: createRequestTypes(`${baseName}_GET_ALL`),
  CREATE: createRequestTypes(`${baseName}_CREATE`),
  UPDATE: createRequestTypes(`${baseName}_UPDATE`),
  DELETE: createRequestTypes(`${baseName}_DELETE`),
};

export const DISTRICTS = new Proxy(districtTypes, typeValidator);
// endregion

// region ACTIONS
export const fetchDistricts = createApiCall(DISTRICTS.GET_ALL, '/districts');
export const createDistrict = createApiCall(DISTRICTS.CREATE, data => ({
  url: `/districts`,
  method: 'POST',
  data,
}));
export const updateDistrict = createApiCall(
  DISTRICTS.UPDATE,
  ({ id, ...data }) => ({
    url: `/districts/${id}`,
    method: 'PUT',
    data,
  })
);
export const deleteDistrict = createApiCall(
  DISTRICTS.DELETE,
  ({ id }) => ({
    url: `/districts/${id}`,
    method: 'DELETE',
  }),
  ({ id }) => ({ districtId: id })
);
// end region

//region REDUCER
const transformDistrict = district =>
  districtSchema.cast(district, {
    context: { mode: 'list' },
  });

const initialState = {
  isLoading: false,
  error: '',
  listById: {},
};
export default function(state = initialState, { type, payload, meta }) {
  switch (type) {
    case DISTRICTS.GET_ALL.REQUEST:
    case DISTRICTS.CREATE.REQUEST:
    case DISTRICTS.UPDATE.REQUEST:
    case DISTRICTS.DELETE.REQUEST:
      return { ...state, isLoading: true };

    case ENUMS.DISTRICTS.SUCCESS:
    case DISTRICTS.GET_ALL.SUCCESS:
      return {
        ...state,
        listById: {
          ...state.listById,
          ...payload.reduce((byId, district) => {
            return { ...byId, [district.id]: transformDistrict(district) };
          }, {}),
        },
        isLoading: false,
      };

    case DISTRICTS.CREATE.SUCCESS:
    case DISTRICTS.UPDATE.SUCCESS:
      return {
        ...state,
        listById: {
          ...state.listById,
          ...{ [payload.id]: transformDistrict(payload) },
        },
        isLoading: false,
      };

    case DISTRICTS.DELETE.SUCCESS:
      const { [`${meta.districtId}`]: val, ...listById } = state.listById;
      return {
        ...state,
        listById,
      };

    case DISTRICTS.GET_ALL.FAILURE:
    case DISTRICTS.CREATE.FAILURE:
    case DISTRICTS.UPDATE.FAILURE:
    case DISTRICTS.DELETE.FAILURE:
      return { ...state, isLoading: false, error: payload };
    default:
      return state;
  }
}
// end region

//#SELECTORS
const getDistrictsState = state => state.districts;
export const getDistrictsList = createSelector(getDistrictsState, state =>
  Object.values(state.listById)
);
export const makeGetDistictById = (districtId) => {
  return createSelector(getDistrictsList, (list) =>
    list.find(item => {
      return item.id === districtId})
  );
};
export const getDistrictsOptions = createSelector(getDistrictsList, districts =>
  districts.map(({ id, name }) => ({
    value: id,
    label: `${id}: ${name}`,
  }))
);
export const isDistrictsLoading = createSelector(
  getDistrictsState,
  state => state.isLoading
);
export const getDistrictsError = createSelector(
  getDistrictsState,
  state => state.error
);
//endregion
