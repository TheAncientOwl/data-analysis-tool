import React from 'react';

// eslint-disable-next-line import/named
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '@store/.';
import { changeValuesToPredict, runPrediction } from '@store/knn/actions';

import { Collapse, Stack, Typography } from '@mui/material';

import { InputWithSave } from '@components/InputWithSave';
import { RunButton } from '@components/buttons';

const Prediction: React.FC<PropsFromRedux> = props => {
  React.useEffect(() => {
    props.changeValuesToPredict(new Array(props.features.length).fill(0));
  }, [props.features]);

  const handleChange = (index: number, value: number) => {
    const newValues = [...props.valuesToPredict];
    newValues[index] = value;

    props.changeValuesToPredict(newValues);
  };

  return (
    <>
      <Stack direction='column' gap={1} mb={2}>
        {props.features.map((label, index) => (
          <InputWithSave
            key={index}
            onSave={value => handleChange(index, value as number)}
            text={props.valuesToPredict[index] === undefined ? 0 : props.valuesToPredict[index]}
            placeholder={label}
            tooltip='Value Saved'
            tooltipUnsaved='Value Not saved. Click to save'
            type='number'
          />
        ))}
      </Stack>

      <RunButton
        sx={{ mb: 2 }}
        disabled={props.valuesToPredict.some(value => value === undefined)}
        onClick={() => props.runPrediction()}>
        predict
      </RunButton>

      <Collapse in={props.prediction !== undefined}>
        <Typography>Prediction: {props.prediction}</Typography>
      </Collapse>
    </>
  );
};

// <redux>
const mapState = (state: RootState) => ({
  prediction: state.knn.prediction,
  valuesToPredict: state.knn.valuesToPredict,
  features: state.knn.features,
});

const mapDispatch = {
  runPrediction,
  changeValuesToPredict,
};

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Prediction);
// </redux>
