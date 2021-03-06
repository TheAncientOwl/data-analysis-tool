import React from 'react';

// eslint-disable-next-line import/named
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '@store/.';
import {
  fetchVariables,
  setDependentVariable,
  setIndependentVariables,
  setRandState,
  setTestSize,
  runModel,
  lockNextStep,
} from '@store/linear-regression/actions';

// eslint-disable-next-line import/named
import { SelectChangeEvent, Stack } from '@mui/material';

import { AnalysisStepLogic } from '@components/analysis';
import { Select, AutoCompleteCheckedSelect, TestSizeSelector } from '@components/select';
import { RunButton } from '@components/buttons';

import { StepsID } from '.';

const ModelPicker: React.FC<PropsFromRedux> = props => {
  React.useEffect(() => {
    props.fetchVariables();
  }, []);

  React.useEffect(() => {
    props.lockNextStep(StepsID.ModelPicker);
  }, [props.independentVariables, props.dependentVariable, props.testSize, props.randomState]);

  const handleIndependentVarsChange = React.useCallback(
    (values: string[]) => props.setIndependentVariables(values),
    [props.setIndependentVariables]
  );

  const handleDependentVarChange = React.useCallback(
    (e: SelectChangeEvent) => props.setDependentVariable(e.target.value),
    [props.setDependentVariable]
  );

  return (
    <AnalysisStepLogic>
      <Stack direction='row' alignItems='center' gap={2} mb={5} maxWidth='100%'>
        <Select
          minWidth='15em'
          id='dependentVar'
          label='Dependent Variable'
          value={props.dependentVariable}
          values={props.variables}
          onChange={handleDependentVarChange}
        />

        <AutoCompleteCheckedSelect
          minWidth='min(25em, 50%)'
          id='independentVars'
          label='independent Variables'
          checkedValues={props.independentVariables}
          possibleValues={props.variables}
          onChange={handleIndependentVarsChange}
        />
      </Stack>

      <TestSizeSelector
        randomState={props.randomState}
        testSize={props.testSize}
        onRandomStateChange={props.setRandState}
        onTestSizeChange={props.setTestSize}
      />

      <RunButton
        disabled={props.independentVariables.length === 0 || props.dependentVariable === ''}
        onClick={() =>
          props.runModel(props.independentVariables, props.dependentVariable, props.testSize / 100, props.randomState)
        }>
        run model
      </RunButton>
    </AnalysisStepLogic>
  );
};

// <redux>
const mapState = (state: RootState) => ({
  dependentVariable: state.linearRegression.dependentVariable,
  independentVariables: state.linearRegression.independentVariables,
  variables: state.linearRegression.variables,
  randomState: state.linearRegression.randState,
  testSize: state.linearRegression.testSize,
});

const mapDispatch = {
  fetchVariables,
  setDependentVariable,
  setIndependentVariables,
  setRandState,
  setTestSize,
  runModel,
  lockNextStep,
};

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(ModelPicker);
// </redux>
