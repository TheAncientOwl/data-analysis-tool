import React from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

import { alpha } from '@mui/system';
import { Box, IconButton } from '@mui/material';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import { Tooltip } from '@components/Tooltip';

import { theme } from '@config/.';

interface Props {
  src: string;
  alt: string;
}

export const Image: React.FC<Props> = ({ src, alt }) => {
  const handleSave = async () => {
    const savePath = await window.electron.showSaveDialog({
      title: 'Save image',
      defaultPath: src,
      buttonLabel: 'Save',
      filters: [
        { name: 'Images', extensions: ['jpg', 'png'] },
        { name: 'All Files', extensions: ['*'] },
      ],
    });

    if (savePath === null) return;

    window.electron.copyFileSync(src, savePath);
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <TransformWrapper>
        <TransformComponent>
          <img style={{ width: '100%', height: '100%' }} src={src} alt={alt} />
        </TransformComponent>
      </TransformWrapper>
      <Tooltip title='Save' placement='top'>
        <IconButton
          sx={{
            position: 'absolute',
            right: theme.spacing(0.5),
            top: theme.spacing(0.5),
            background: alpha(theme.palette.common.black, 0.9),
            ':hover': {
              background: alpha(theme.palette.primary.main, 0.9),
            },
          }}
          onClick={handleSave}>
          <SaveAltIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};
