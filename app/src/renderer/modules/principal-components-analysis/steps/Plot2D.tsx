import React from 'react';

import { v4 as uuidv4 } from 'uuid';

// eslint-disable-next-line import/named
import { Box, Grid, SelectChangeEvent, Collapse, IconButton, Stack } from '@mui/material';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import DeleteIcon from '@mui/icons-material/Delete';
import AddBoxIcon from '@mui/icons-material/AddBox';

import { Tooltip } from '../../../components/Tooltip';
import { CheckedButton, PlotButton } from '../../../components/buttons';
import { Paper } from '../../../components/Paper';
import { Select } from '../../../components/select/Select';
import { Image } from '../../../components/Image';
import { Checkbox } from '../../../components/Checkbox';
import { InputWithSave } from '../../../components/InputWithSave';
import { AutoCompleteCheckedSelect } from '../../../components/select';
import { RenderIf } from '../../../components/RenderIf';

const visibleIcon = <VisibilityIcon />;
const hiddenIcon = <VisibilityOffIcon />;
const deleteIcon = <DeleteIcon />;
const addIcon = <AddBoxIcon />;

const separator = <Stack mt={2} mb={2} sx={{ bgcolor: 'grey.700', p: 0.1 }}></Stack>;

export interface IPlot2D {
  open: boolean;
  id: string;
  xLabel: string;
  yLabel: string;
  plotSrc: string;
  annot: boolean;
  legend: boolean;
  targets: string[];
  title: string;
}

export const createPlot = (): IPlot2D => ({
  id: uuidv4(),
  xLabel: '',
  yLabel: '',
  plotSrc: '',
  annot: false,
  legend: false,
  targets: [],
  open: true,
  title: '',
});

const emptyPlot = createPlot();

interface IPlotEvents {
  onChangeAxisX: (event: SelectChangeEvent) => void;
  onChangeAxisY: (event: SelectChangeEvent) => void;
  onPlot: () => void;
  onToggleAnnot: () => void;
  onToggleLegend: () => void;
  onTargetsChange?: (values: string[]) => void;
  onToggleOpen: () => void;
  onDelete: () => void;
  onTitleChange: (value: string) => void;
  onPushDefaultPlot: () => void;
}

interface Props extends IPlotEvents {
  plot: IPlot2D;

  pcaLabels: string[];
  targets: string[];
  disableDelete: boolean;
}

export const Plot2D: React.FC<Props> = props => {
  const plot: IPlot2D = props.plot !== undefined ? props.plot : emptyPlot;

  const mainToolbar = (
    <Stack direction='row' gap={1}>
      <Tooltip title={plot.open ? 'Hide' : 'Show'}>
        <IconButton onClick={props.onToggleOpen} color='info'>
          {plot.open ? visibleIcon : hiddenIcon}
        </IconButton>
      </Tooltip>

      <InputWithSave
        minWidth='35em'
        text={plot.title}
        placeholder='Title'
        tooltip='Save Title'
        tooltipUnsaved='Save. (not saved)'
        onSave={props.onTitleChange}
      />

      <Box sx={{ flexGrow: 1 }}></Box>

      <Tooltip title='New plot'>
        <IconButton onClick={props.onPushDefaultPlot} color='info'>
          {addIcon}
        </IconButton>
      </Tooltip>

      <RenderIf condition={!props.disableDelete}>
        <Tooltip title='Delete'>
          <IconButton onClick={props.onDelete} color='error'>
            {deleteIcon}
          </IconButton>
        </Tooltip>
      </RenderIf>
    </Stack>
  );

  const optionsToolbar = (
    <Grid container alignItems='center' gap={2} pt={1} sx={{ overflow: 'hidden' }}>
      <Grid item>
        <Select
          minWidth={'7em'}
          maxWidth={'20em'}
          id='xLabel'
          label='X Axis'
          value={plot.xLabel}
          values={props.pcaLabels}
          onChange={props.onChangeAxisX}
        />
      </Grid>

      <Grid item>
        <Select
          minWidth={'7em'}
          maxWidth={'20em'}
          id='yLabel'
          label='Y Axis'
          value={plot.yLabel}
          values={props.pcaLabels}
          onChange={props.onChangeAxisY}
        />
      </Grid>

      <Grid item>
        <Checkbox checked={plot.annot} onChange={props.onToggleAnnot} label='Annotations' />
      </Grid>

      <Grid item>
        <Checkbox checked={plot.legend} onChange={props.onToggleLegend} label='Legend' />
      </Grid>

      <RenderIf condition={props.targets.length > 0}>
        <Grid item>
          <CheckedButton
            checked={props.targets.length === plot.targets.length}
            onClick={() => props.onTargetsChange(props.targets.length === plot.targets.length ? [] : props.targets)}>
            all targets
          </CheckedButton>
        </Grid>

        <Grid item xs={12}>
          <RenderIf condition={props.targets.length !== plot.targets.length}>
            <AutoCompleteCheckedSelect
              minWidth='10em'
              id='select-targets'
              label='Targets'
              checkedValues={plot.targets}
              possibleValues={props.targets}
              onChange={props.onTargetsChange}
            />
          </RenderIf>
        </Grid>
      </RenderIf>

      <Grid item>
        <PlotButton
          disabled={plot.xLabel === '' || plot.yLabel === '' || plot.targets.length === 0}
          onClick={props.onPlot}
          size='small'>
          plot
        </PlotButton>
      </Grid>
    </Grid>
  );

  return (
    <Paper sx={{ mt: 2, display: 'block', p: 2 }}>
      {mainToolbar}
      {separator}

      <Collapse in={plot.open}>
        {optionsToolbar}

        <RenderIf condition={plot.plotSrc !== ''}>
          <Box sx={{ mt: 2, maxWidth: '40em' }}>
            <Image src={plot.plotSrc} alt={`Plot ${plot.xLabel} - ${plot.yLabel}`} />
          </Box>
        </RenderIf>
      </Collapse>
    </Paper>
  );
};
