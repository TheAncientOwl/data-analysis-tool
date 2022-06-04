import React from 'react';

import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import { IButtonProps } from './IButtonProps';
import { Tooltip } from '../Tooltip';

const icon = <DeleteIcon />;

export const DeleteButton: React.FC<IButtonProps> = props => {
  return (
    <Tooltip title={props.children}>
      <IconButton color='error' {...props}>
        {icon}
      </IconButton>
    </Tooltip>
  );
};
