import React from 'react';

import { store } from '@store/.';
import { setServerLabelFeatures } from '@store/k-means/actions';

import { IStep } from '@components/analysis';

import ModelPicker from './ModelPicker';

export const StepsID = Object.freeze({
  ModelPicker: 0,
});

export const StepsClusterAnalysis: ReadonlyArray<IStep> = [
  {
    index: StepsID.ModelPicker,
    title: 'Pick model arguments',
    content: <ModelPicker />,
    onNext: () => {
      store.dispatch(setServerLabelFeatures());
    },
  },
];
