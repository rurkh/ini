import { createAction } from 'redux-actions';
import { typeValidator } from 'utils/typeValidator';

//region ACTION TYPES
const appTypes = {
  START: 'APP_START',
  SHUTDOWN: 'APP_SHUTDOWN',
  PRELOAD: 'PRELOAD',
  PRELOAD_FINISHED: 'PRELOAD_FINISHED',
};
export const APP = new Proxy(appTypes, typeValidator);
//endregion

//region ACTIONS
export const appStart = createAction(APP.START);
export const appShutdown = createAction(APP.SHUTDOWN);
export const preloadData = createAction(APP.PRELOAD);
export const preloadDataFinished = createAction(APP.PRELOAD_FINISHED);
//endregion

//region REDUCER
const initialState = {
  preloading: 'undef',
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case APP.PRELOAD:
      return { ...state, preloading: 'running' };

    case APP.PRELOAD_FINISHED:
      return { ...state, preloading: 'done' };

    default:
      return state;
  }
};
//endregion

//region SELECTORS
export const isDataPreloaded = state => state.app.ui.preloading !== 'done';
//endregion
