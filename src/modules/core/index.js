import { combineReducers } from 'redux';
import ui from './app';
import enums from './enum';

export default combineReducers({
  ui,
  enum: enums,
});
