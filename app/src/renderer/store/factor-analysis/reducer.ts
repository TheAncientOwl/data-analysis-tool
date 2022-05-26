import { BartlettTest, ActionType, DispatchTypes, DefaultHints } from './types';

import { IDefaultAnalysisStep, newNextStepUnlockedArray } from '@store/IDefaultAnalysisState';
import { ComponentsID } from '@src/renderer/modules/factor-analysis/config/componentsID';

const StepsCountFactorAnalysis = 4;

interface IDefaultState extends IDefaultAnalysisStep {
  possibleFeatures: string[];
  features: string[];

  kmoModel: number;
  bartlett: BartlettTest;

  factorsNumber: number;

  defaultHints: DefaultHints;
}

const defaultState: IDefaultState = {
  loading: false,
  currentStep: 0,
  nextStepUnlocked: new Array(StepsCountFactorAnalysis).fill(false),

  possibleFeatures: [],
  features: [],

  factorsNumber: 2,

  kmoModel: undefined,
  bartlett: {
    chiSquare: undefined,
    pValue: undefined,
  },

  defaultHints: {
    eigenvalues: { columns: [], data: [], index: [] },
    screePlotSrc: '',
  },
};

export const factorAnalysisReducer = (state: IDefaultState = defaultState, action: DispatchTypes): IDefaultState => {
  switch (action.type) {
    case ActionType.Loading: {
      if (state.loading) return state;

      return {
        ...state,
        loading: true,
      };
    }

    case ActionType.NextStep: {
      return {
        ...state,
        currentStep: Math.min(StepsCountFactorAnalysis, state.currentStep + 1),
      };
    }

    case ActionType.PrevStep: {
      return {
        ...state,
        currentStep: Math.max(0, state.currentStep - 1),
      };
    }

    case ActionType.UnlockNextStep: {
      if (state.nextStepUnlocked[action.payload]) return state;

      return {
        ...state,
        nextStepUnlocked: newNextStepUnlockedArray(state.nextStepUnlocked, action.payload, true),
      };
    }

    case ActionType.LockNextStep: {
      if (!state.nextStepUnlocked[action.payload]) return state;

      return {
        ...state,
        nextStepUnlocked: newNextStepUnlockedArray(state.nextStepUnlocked, action.payload, false),
      };
    }

    case ActionType.FetchedPossibleFeatures: {
      return {
        ...state,
        loading: false,
        possibleFeatures: action.payload,
      };
    }

    case ActionType.ChangeFeatures: {
      return {
        ...state,
        features: action.payload,
      };
    }

    case ActionType.ChangeFactorsNumber: {
      return {
        ...state,
        factorsNumber: action.payload,
      };
    }

    case ActionType.FetchedBartlettResults: {
      return {
        ...state,
        loading: false,
        bartlett: action.payload,
      };
    }

    case ActionType.FetchedKmoResult: {
      return {
        ...state,
        loading: false,
        kmoModel: action.payload,
      };
    }

    case ActionType.AnalysisFinished: {
      if (!state.loading) return state;

      return {
        ...state,
        loading: false,
      };
    }

    case ActionType.FetchedDefaultHints: {
      return {
        ...state,
        loading: false,
        defaultHints: action.payload,
        nextStepUnlocked: newNextStepUnlockedArray(state.nextStepUnlocked, ComponentsID.DefaultFactorAnalysis, true),
      };
    }

    case ActionType.ServerSetFeaturesSuccess: {
      return {
        ...state,
        loading: false,
      };
    }

    case ActionType.JumpToStep: {
      const stepIndex = action.payload;

      const newNextStepUnlocked = new Array(state.nextStepUnlocked.length);
      newNextStepUnlocked.fill(true, 0, stepIndex);

      return {
        ...state,
        currentStep: stepIndex,
        nextStepUnlocked: newNextStepUnlocked,
      };
    }

    case ActionType.Reset: {
      return defaultState;
    }

    default: {
      return state;
    }
  }
};
