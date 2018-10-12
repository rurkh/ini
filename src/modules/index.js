import { routerReducer } from 'react-router-redux';
import { combineReducers } from 'redux';
import app from './core';
import auth from './auth';
import users from './users';
import depositions from './depositions';
import districts from './districts';
import deliverers from './deliverers';
import currentUser from './user';
import reclamations from './reclamation';
import characteristics from './delivery_characteristics';
import messages from './messages';
import notifications from './notifications';

//region REDUCER
const rootReducer = combineReducers({
  auth,
  app,
  router: routerReducer,
  currentUser,
  users,
  depositions,
  districts,
  characteristics,
  deliverers,
  reclamations,
  messages,
  notifications,
});

export default rootReducer;
//endregion
