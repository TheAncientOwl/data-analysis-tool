import React from 'react';

import { axios } from '@renderer/config';

import {
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  // eslint-disable-next-line import/named
  SelectChangeEvent,
  Stack,
} from '@mui/material';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';

import { ActionType } from './state';
import { PCA_Context } from './context';

interface PossibleValues {
  targets: string[];
  features: string[];
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      minWidth: 200,
    },
  },
};

const VerticalLine = <Stack sx={{ m: 1, bgcolor: 'grey.700', p: 0.1 }}></Stack>;

export const TargetAndFeaturesPicker: React.FC = () => {
  const { dispatch, state } = React.useContext(PCA_Context);

  const [possibleValues, setPossibleValues] = React.useState<PossibleValues>({
    targets: [],
    features: [],
  });

  React.useEffect(() => {
    dispatch({ type: ActionType.Loading });

    axios.get('/pca/possible/targets&features').then(res => {
      setPossibleValues(res.data);

      dispatch({ type: ActionType.EndLoading });
    });
  }, []);

  const handleTargetChange = (event: SelectChangeEvent) => {
    dispatch({ type: ActionType.ChangeTarget, payload: event.target.value as string });
  };

  const handleFeaturesChange = (event: SelectChangeEvent<string[]>) => {
    dispatch({ type: ActionType.SetFeatures, payload: new Set<string>(event.target.value) });
  };

  const handleSelectAllClick = () => {
    if (possibleValues.features.length === state.features.size) dispatch({ type: ActionType.ClearFeatures });
    else dispatch({ type: ActionType.SetFeatures, payload: new Set<string>(possibleValues.features) });
  };

  return (
    <Stack direction='row' gap={1}>
      <FormControl sx={{ minWidth: '6em' }}>
        <InputLabel id='select-target-label'>Target</InputLabel>
        <Select
          labelId='select-target-label'
          id='select-target'
          value={possibleValues.targets?.length > 0 ? state.target : ''}
          label='Display Targets'
          onChange={handleTargetChange}>
          {possibleValues.targets.map(target => (
            <MenuItem key={target} value={target}>
              {target}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {VerticalLine}

      <Button
        variant='contained'
        size='medium'
        disableElevation
        startIcon={
          possibleValues.features.length === state.features.size ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />
        }
        onClick={handleSelectAllClick}>
        all
      </Button>

      <FormControl sx={{ minWidth: '10em' }}>
        <InputLabel id='select-features-label'>Features</InputLabel>
        <Select
          labelId='select-features-label'
          id='select-features'
          multiple
          value={Array.from(state.features)}
          label='Display Features'
          onChange={handleFeaturesChange}
          input={<OutlinedInput label='Tag' />}
          renderValue={selected => selected.join(', ')}
          MenuProps={MenuProps}>
          {possibleValues.features.map(feature => (
            <MenuItem key={feature} value={feature}>
              <Checkbox checked={state.features.has(feature)} />
              <ListItemText primary={feature} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
};
