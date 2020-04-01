import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { compose } from 'redux';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
// import logger from 'redux-logger';
import { AsyncStorage } from 'react-native';
// import { reactotron } from './middleware/reactotronMiddleware';
import rootReducer from './rootReducer';

const enhancers = [
  ...getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }),
];
/* Enable redux dev tools only in development.
 * We suggest using the standalone React Native Debugger extension:
 * https://github.com/jhen0409/react-native-debugger
 */

if (process.env.NODE_ENV === 'development') {
  // enhancers.push(logger);
}
/* eslint-disable no-undef */
const composeEnhancers = (__DEV__ && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
/* eslint-enable no-undef */

const enhancer = composeEnhancers(enhancers); //, reactotron.createEnhancer());

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

// create the store => configureStore
// const store = createStore(reducer, enhancer, autoRehydrate());
const store = configureStore({
  reducer: persistReducer(persistConfig, rootReducer),
  middleware: enhancer,
});

const persistor = persistStore(store);

export { persistor };

export default store;
