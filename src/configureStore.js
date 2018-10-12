import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';
import createHistory from 'history/createBrowserHistory';
import { routerMiddleware } from 'react-router-redux';
import rootReducer from 'modules';
import rootSaga from 'sagas';

const middleware = [];
const sagaMiddleware = createSagaMiddleware();
middleware.push(sagaMiddleware);

export const history = createHistory();
middleware.push(routerMiddleware(history));

process.env.NODE_ENV === 'development' && middleware.push(logger);

const composeEnhancers =
  (process.env.NODE_ENV !== 'production' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;

const enhancers = composeEnhancers(applyMiddleware(...middleware));

const configureStore = () => {
  return {
    ...createStore(rootReducer, enhancers),
    runSaga: sagaMiddleware.run(rootSaga),
  };
};

export default configureStore;
