import React from 'react';

import { RotationMethod, FactorLoadings } from '@store/factor-analysis/types';

import { Stack, Collapse, Grid, Typography } from '@mui/material';

import { Select } from '@components/Select';
import { DeleteButton, RunButton, NewButton, ExportButton } from '@components/buttons';
import { AnalysisStepLogic, AnalysisStepResult } from '@components/analysis-step';
import { AnalysisImage } from '@components/AnalysisImage';
import { Paper } from '@components/Paper';

interface Props {
  factorsCount: string;
  factorsOptions: string[];
  rotationMethod: RotationMethod;
  rotationOptions: RotationMethod[];
  loadings: FactorLoadings;
  onFactorsChange: (value: number) => void;
  onRotationMethodChange: (value: RotationMethod) => void;
  onNewTab: () => void;
  onRemove: () => void;
  onRun: () => void;
}

export const AxisRotation: React.FC<Props> = props => {
  return (
    <>
      <AnalysisStepLogic>
        <Stack direction='row' gap={2} mb={2}>
          <Select
            minWidth='5em'
            id='factors'
            label='Factors'
            value={props.factorsCount}
            values={props.factorsOptions}
            onChange={event => props.onFactorsChange(+event.target.value)}
          />

          <Select
            minWidth='6em'
            id='rotation-method'
            label='Rotation'
            value={props.rotationMethod}
            values={props.rotationOptions}
            onChange={event => props.onRotationMethodChange(event.target.value as RotationMethod)}
          />

          <RunButton onClick={props.onRun}>run</RunButton>

          <NewButton onClick={props.onNewTab}>new tab</NewButton>

          <DeleteButton onClick={props.onRemove}>remove</DeleteButton>
        </Stack>
      </AnalysisStepLogic>

      <AnalysisStepResult>
        <Grid container>
          <Grid item xs={7}>
            <Collapse in={props.loadings.data.data.length > 0}>
              <Paper>
                <Stack mb={1} direction='row' justifyItems='center' gap={2}>
                  <Typography variant='h6'>Loadings Matrix</Typography>
                  <ExportButton size='small' onClick={() => console.log('export')}>
                    export
                  </ExportButton>
                </Stack>
                <AnalysisImage src={props.loadings.imagePath} alt={`${props.rotationMethod}-${props.factorsCount}`} />
              </Paper>
            </Collapse>
          </Grid>
        </Grid>
      </AnalysisStepResult>
    </>
  );
};
