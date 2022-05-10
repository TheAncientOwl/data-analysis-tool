import React from 'react';

// eslint-disable-next-line import/named
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '@store/.';
import { fetchLoadingsMatrixPath, jumpToStep } from '@store/principal-components-analysis/actions';

import { Box, Button, Stack } from '@mui/material';

import { Paper } from '@components/Paper';
import { AnalysisImage } from '@components/AnalysisImage';
import { AnalysisStepLogic, AnalysisStepResult } from '@components/analysis-step';

import { StepsPCA } from './StepsPCA';
import { ComponentIndexPCA } from './ComponentIndexPCA';

const LoadingsMatrix: React.FC<PropsFromRedux> = props => {
  const handleSkip = () => {
    props.jumpToStep(ComponentIndexPCA.LoadingsMatrix + 1);
    StepsPCA[ComponentIndexPCA.LoadingsMatrix]?.onNext?.();
  };

  return (
    <>
      <AnalysisStepLogic>
        <Stack direction='row' gap={1}>
          <Button onClick={props.fetchLoadingsMatrixPath} size='small' color='info'>
            Plot
          </Button>
          {props.loadingsMatrixPath === '' && !props.nextStepUnlocked(ComponentIndexPCA.LoadingsMatrix) && (
            <Button onClick={handleSkip} size='small' color='warning'>
              Skip
            </Button>
          )}
        </Stack>
      </AnalysisStepLogic>
      <AnalysisStepResult>
        {props.loadingsMatrixPath !== '' && (
          <Paper sx={{ mt: 2, maxWidth: '38em' }}>
            <Box sx={{ mt: 2, maxWidth: '35em' }}>
              <AnalysisImage src={props.loadingsMatrixPath} alt='Loadings Matrix' />
            </Box>
          </Paper>
        )}
      </AnalysisStepResult>
    </>
  );
};

// <redux>
const mapState = (state: RootState) => ({
  loadingsMatrixPath: state.pca.loadingsMatrixPath,
  nextStepUnlocked: (step: number) => state.pca.nextStepUnlocked[step],
});

const mapDispatch = {
  fetchLoadingsMatrixPath,
  jumpToStep,
};

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(LoadingsMatrix);
// </redux>
