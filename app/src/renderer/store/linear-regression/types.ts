// eslint-disable-next-line import/named
import { Dispatch as ReduxDispatch } from 'redux';

export enum ActionType {
  Loading = 'LINEAR_REGRESSION__LOADING',
  Reset = 'LINEAR_REGRESSION__RESET',

  NextStep = 'LINEAR_REGRESSION__NEXT_STEP',
  PrevStep = 'LINEAR_REGRESSION__PREV_STEP',
  UnlockNextStep = 'LINEAR_REGRESSION__UNLOCK_NEXT_STEP',
  LockNextStep = 'LINEAR_REGRESSION__LOCK_NEXT_STEP',
  JumpToStep = 'LINEAR_REGRESSION__JUMP_TO_STEP',

  SetIndependentVariables = 'LINEAR_REGRESSION__SET_INDEPENDENT_VARIABLES',
  SetDependentVariable = 'LINEAR_REGRESSION__SET_DEPENDENT_VARIABLE',
  SetRandState = 'LINEAR_REGRESSION__SET_RAND_STATE',
  SetTestSize = 'LINEAR_REGRESSION__SET_TEST_SIZE',
  ModelFinished = 'LINEAR_REGRESSION__MODEL_FINISHED',
  FetchedVariables = 'LINEAR_REGRESSION__FETCHED_VARIABLES',

  ChangeValuesToPredict = 'LINEAR_REGRESSION__CHANGE_VALUES_TO_PREDICT',
  PredictionFinished = 'LINEAR_REGRESSION__PREDICTION_FINISHED',
}

interface Loading {
  type: ActionType.Loading;
}

interface Reset {
  type: ActionType.Reset;
}

interface NextStep {
  type: ActionType.NextStep;
}

interface PrevStep {
  type: ActionType.PrevStep;
}

interface UnlockNextStep {
  type: ActionType.UnlockNextStep;
  payload: number;
}

interface LockNextStep {
  type: ActionType.LockNextStep;
  payload: number;
}

interface JumpToStep {
  type: ActionType.JumpToStep;
  payload: number;
}

interface SetDependentVariables {
  type: ActionType.SetIndependentVariables;
  payload: string[];
}

interface SetIndependentVariable {
  type: ActionType.SetDependentVariable;
  payload: string;
}

interface SetRandState {
  type: ActionType.SetRandState;
  payload: number;
}

interface SetTestSize {
  type: ActionType.SetTestSize;
  payload: number;
}

export interface IModelResult {
  coeff: number[];
  intercept: number;
  equation: string;
  mse: number;
  rSquaredAdj: number;
  rSquared: number;
}
interface ModelFinished {
  type: ActionType.ModelFinished;
  payload: IModelResult;
}

interface ChangeValuesToPredict {
  type: ActionType.ChangeValuesToPredict;
  payload: number[];
}

interface PredictionFinished {
  type: ActionType.PredictionFinished;
  payload: number;
}

interface FetchedVariables {
  type: ActionType.FetchedVariables;
  payload: string[];
}

export type DispatchTypes =
  | Loading
  | Reset
  | NextStep
  | PrevStep
  | UnlockNextStep
  | LockNextStep
  | JumpToStep
  | SetIndependentVariable
  | SetDependentVariables
  | SetRandState
  | SetTestSize
  | ModelFinished
  | ChangeValuesToPredict
  | PredictionFinished
  | FetchedVariables;

export type Dispatch = ReduxDispatch<DispatchTypes>;
