import { svmReducer } from './svm/reducer';
import { somReducer } from './som/reducer';
import { knnReducer } from './knn/reducer';
import { kMeansReducer } from './k-means/reducer';
import { correspondenceAnalysisReducer } from './correspondence-analysis/reducer';
import { logisticRegressionReducer } from './logistic-regression/reducer';
import { linearRegressionReducer } from './linear-regression/reducer';
import { factorAnalysisReducer } from './factor-analysis/reducer';
import { principalComponentsAnalysisReducer } from './principal-components-analysis/reducer';
import { dataManagerReducer } from './data-manager/reducer';
import { appGlobalReducer } from './app-global/reducer';

import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';

export const store = configureStore({
  reducer: {
    svm: svmReducer,
    som: somReducer,
    knn: knnReducer,
    kMeans: kMeansReducer,
    correspondenceAnalysis: correspondenceAnalysisReducer,
    logisticRegression: logisticRegressionReducer,
    linearRegression: linearRegressionReducer,
    factorAnalysis: factorAnalysisReducer,
    pca: principalComponentsAnalysisReducer,
    dataManager: dataManagerReducer,
    appGlobal: appGlobalReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(thunk),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export { resetAppState } from './resetAppState';
