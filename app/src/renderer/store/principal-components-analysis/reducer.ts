import { StepsID } from '@modules/principal-components-analysis/steps';
import { IPlot2D, createPlot } from '@modules/principal-components-analysis/steps/Plot2D';

import { IAnalysisHints, PossibleTF, ActionType, DispatchTypes } from './types';
import {
  IDefaultAnalysisStep,
  newNextStepUnlockedArray,
  loading,
  nextStep,
  prevStep,
  unlockNextStep,
  lockNextStep,
  jumpToStep,
} from '@store/IDefaultAnalysisState';

const StepsCountPCA = 6;

interface IDefaultState extends IDefaultAnalysisStep {
  target: string;
  features: string[];

  analysisComponentsCount: number;
  analysisHints: IAnalysisHints;
  hintsOpen: boolean;

  correlationMatrixPath: string;
  loadingsMatrixPath: string;

  plot: {
    pcaLabels: string[];
    targets: string[];
  };
  plots: IPlot2D[];

  possible: PossibleTF;
}

const defaultState: IDefaultState = {
  loading: false,

  currentStep: 0,
  nextStepUnlocked: new Array(StepsCountPCA).fill(false),

  target: '',
  features: [],

  analysisComponentsCount: 2,
  analysisHints: {
    kaiserPath: '',
    threshold70: { columns: [], data: [], index: [] },
    eigenvaluesG1: { columns: [], data: [], index: [] },
  },
  hintsOpen: false,

  correlationMatrixPath: '',
  loadingsMatrixPath: '',

  plot: {
    pcaLabels: [],
    targets: [],
  },
  plots: [createPlot()],

  possible: {
    targets: [],
    features: [],
  },
};

export const principalComponentsAnalysisReducer = (
  state: IDefaultState = defaultState,
  action: DispatchTypes
): IDefaultState => {
  switch (action.type) {
    case ActionType.Loading: {
      return loading(state) as IDefaultState;
    }

    case ActionType.NextStep: {
      return nextStep(state, StepsCountPCA) as IDefaultState;
    }

    case ActionType.PrevStep: {
      return prevStep(state) as IDefaultState;
    }

    case ActionType.UnlockNextStep: {
      return unlockNextStep(state, action.payload) as IDefaultState;
    }

    case ActionType.LockNextStep: {
      return lockNextStep(state, action.payload) as IDefaultState;
    }

    case ActionType.JumpToStep: {
      return jumpToStep(state, action.payload) as IDefaultState;
    }

    case ActionType.FetchedPossibleTargetsFeatures: {
      return {
        ...state,
        loading: false,
        possible: action.payload,
      };
    }

    case ActionType.ChangeTarget: {
      // features not set ? old unlockedSteps : new set with next step unlocked
      const getSteps = () =>
        state.features.length < 2
          ? state.nextStepUnlocked
          : newNextStepUnlockedArray(state.nextStepUnlocked, StepsID.TargetAndFeaturesPicker, true);

      return {
        ...state,
        target: action.payload,
        nextStepUnlocked: getSteps(),
        correlationMatrixPath: '',
      };
    }

    case ActionType.ChangeFeatures: {
      // target not set ? old unlockedSteps : new set with next step unlocked
      const getSteps = () =>
        state.target === ''
          ? state.nextStepUnlocked
          : newNextStepUnlockedArray(state.nextStepUnlocked, StepsID.TargetAndFeaturesPicker, true);

      return {
        ...state,
        features: action.payload,
        nextStepUnlocked: getSteps(),
        correlationMatrixPath: '',
        // scaledData: false,
      };
    }

    case ActionType.ServerSetTargetFeaturesSuccess: {
      return {
        ...state,
        loading: false,
      };
    }

    case ActionType.FetchedCorrelationMatrixPath: {
      const newSteps = newNextStepUnlockedArray(state.nextStepUnlocked, StepsID.CorrelationMatrix, true);

      return {
        ...state,
        loading: false,
        correlationMatrixPath: action.payload,
        nextStepUnlocked: newSteps,
      };
    }

    case ActionType.FetchedAnalysisHints: {
      return {
        ...state,
        loading: false,
        analysisHints: action.payload,
      };
    }

    case ActionType.ChangeComponentsCount: {
      if (action.payload === state.analysisComponentsCount) return state;

      const newSteps = new Array(StepsCountPCA).fill(false);
      newSteps.fill(true, 0, StepsID.ComponentsCountPicker);

      return {
        ...state,
        analysisComponentsCount: action.payload,
        nextStepUnlocked: newSteps,
        loadingsMatrixPath: '',
        plots: [createPlot()],
      };
    }

    case ActionType.AnalysisFinished: {
      const newSteps = newNextStepUnlockedArray(state.nextStepUnlocked, StepsID.ComponentsCountPicker, true);

      return {
        ...state,
        loading: false,
        nextStepUnlocked: newSteps,
      };
    }

    case ActionType.FetchedLoadingsMatrixPath: {
      const newSteps = newNextStepUnlockedArray(state.nextStepUnlocked, StepsID.LoadingsMatrix, true);

      return {
        ...state,
        loading: false,
        loadingsMatrixPath: action.payload,
        nextStepUnlocked: newSteps,
      };
    }

    case ActionType.FetchedLabelsTargetsPCA: {
      const { targets, labels } = action.payload;

      return {
        ...state,
        loading: false,
        plot: {
          targets: targets,
          pcaLabels: labels,
        },
      };
    }

    case ActionType.PushDefaultPlot: {
      const newPlots: IPlot2D[] = [...state.plots, createPlot()];

      return {
        ...state,
        plots: newPlots,
      };
    }

    case ActionType.ChangePlotAxisX: {
      const { index, value } = action.payload;

      if (state.plots[index].xLabel === value) return state;

      const newPlots = [...state.plots];
      newPlots[index] = { ...newPlots[index], xLabel: value };

      return {
        ...state,
        plots: newPlots,
      };
    }

    case ActionType.ChangePlotAxisY: {
      const { index, value } = action.payload;

      if (state.plots[index].yLabel === value) return state;

      const newPlots = [...state.plots];
      newPlots[index] = { ...newPlots[index], yLabel: value };

      return {
        ...state,
        plots: newPlots,
      };
    }

    case ActionType.FetchedPlotSrc: {
      const { index, value } = action.payload;

      if (state.plots[index].plotSrc === value)
        return {
          ...state,
          loading: false,
        };

      const newPlots = [...state.plots];
      newPlots[index] = { ...newPlots[index], plotSrc: value };

      return {
        ...state,
        loading: false,
        plots: newPlots,
      };
    }

    case ActionType.ClearPlots: {
      return {
        ...state,
        plots: [],
      };
    }

    case ActionType.TogglePlotAnnot: {
      const index = action.payload;
      const newPlots = [...state.plots];
      newPlots[index] = { ...newPlots[index], annot: !newPlots[index].annot };

      return {
        ...state,
        plots: newPlots,
      };
    }

    case ActionType.TogglePlotLegend: {
      const index = action.payload;
      const newPlots = [...state.plots];
      newPlots[index] = { ...newPlots[index], legend: !newPlots[index].legend };

      return {
        ...state,
        plots: newPlots,
      };
    }

    case ActionType.ChangePlotTargets: {
      const { index, targets } = action.payload;

      if (JSON.stringify(state.plots[index].targets) === JSON.stringify(targets)) return state;

      const newPlots = [...state.plots];
      newPlots[index] = { ...newPlots[index], targets: targets };

      return {
        ...state,
        plots: newPlots,
      };
    }

    case ActionType.TogglePlotOpen: {
      const index = action.payload;
      const newPlots = [...state.plots];
      newPlots[index] = { ...newPlots[index], open: !newPlots[index].open };

      return {
        ...state,
        plots: newPlots,
      };
    }

    case ActionType.DeletePlot: {
      if (state.plots.length === 1) return state;

      const index = action.payload;
      const newPlots = [...state.plots];
      newPlots.splice(index, 1);

      return {
        ...state,
        plots: newPlots,
      };
    }

    case ActionType.ChangePlotTitle: {
      const { index, value } = action.payload;

      if (state.plots[index].title === value) return state;

      const newPlots = [...state.plots];
      newPlots[index] = { ...newPlots[index], title: value };

      return {
        ...state,
        plots: newPlots,
      };
    }

    case ActionType.ExportLoadingsEnded: {
      if (!state.loading) return state;

      return {
        ...state,
        loading: false,
      };
    }

    // TODO: add message on fail
    case ActionType.ExportLoadingsFail: {
      return {
        ...state,
        loading: false,
      };
    }

    case ActionType.ExportPCAEnded: {
      if (!state.loading) return state;

      return {
        ...state,
        loading: false,
      };
    }

    // TODO: add message on fail
    case ActionType.ExportPCAFail: {
      return {
        ...state,
        loading: false,
      };
    }

    case ActionType.Reset: {
      return defaultState;
    }

    case ActionType.ToggleHints: {
      return {
        ...state,
        hintsOpen: !state.hintsOpen,
      };
    }

    default: {
      return state;
    }
  }
};
