import { configureStore } from '@reduxjs/toolkit';

import { dataManagerReducer } from './data-manager/reducer';
import { principalComponentsAnalysisReducer } from './principal-components-analysis/reducer';

import thunk from 'redux-thunk';

export const store = configureStore({
  reducer: {
    dataManager: dataManagerReducer,
    pca: principalComponentsAnalysisReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(thunk),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;