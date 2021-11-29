import React from 'react';

import { Box, Button, IconButton, CircularProgress, Stack, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import { useLocalStorage } from '@renderer/hooks/useLocalStorage';
import { useSnackbar } from '@renderer/hooks/useSnackbar';
import { useSwitch } from '@renderer/hooks/useSwitch';
import { useRequest, RequestState } from '@renderer/hooks/useRequest';

import { DoubleCheck } from '@renderer/components/DoubleCheck';

export const Import: React.FC = () => {
  const [importPath, setImportPath] = useLocalStorage<string | null>('import-path', null);
  const [doubleCheckSwitch, toggleDoubleCheck] = useSwitch(false);
  const request = useRequest();

  const snackbar = useSnackbar({
    title: 'Success',
    message: 'Data deleted!',
    severity: 'success',
    variant: 'filled',
  });

  const importData = async () => {
    const filePath = await window.electronAPI.showOpenCsvDialog();

    if (filePath === null) return;

    request.execute({ method: 'get', url: `/data/import/csv/${filePath}` }, () => {
      setImportPath(filePath);

      snackbar.setMessage('Data loaded!');
      snackbar.open();
    });
  };

  const cancelDeleteData = () => {
    toggleDoubleCheck();
  };

  const deleteData = () => {
    request.execute({ method: 'get', url: '/data/delete' }, () => {
      setImportPath(null);

      snackbar.setMessage('Data deleted!');
      snackbar.open();
    });
    toggleDoubleCheck();
  };

  return (
    <Box>
      <DoubleCheck
        open={doubleCheckSwitch}
        title='Double check'
        text={
          <React.Fragment>
            This action will{' '}
            <Box component='span' sx={{ color: 'error.main' }}>
              delete
            </Box>{' '}
            the data imported from <Box component='span' sx={{ color: 'info.main' }}>{`"${importPath}"`}</Box>
            <br />
            Are you sure?
          </React.Fragment>
        }
        onAccept={{
          title: 'Delete',
          execute: deleteData,
          buttonColor: 'error',
        }}
        onReject={{
          title: 'Cancel',
          execute: cancelDeleteData,
          buttonColor: 'info',
        }}
      />

      <Box sx={{ display: 'flex' }}>
        <Button onClick={importData} sx={{ mb: 2, display: 'block' }} variant='contained' size='small' disableElevation>
          Search
        </Button>
        {request.state === RequestState.Pending && (
          <CircularProgress sx={{ ml: 2 }} size={30} thickness={4} color='info' />
        )}
      </Box>

      {importPath !== null && (
        <Stack direction='row' alignItems='center' spacing={1}>
          <IconButton sx={{ color: 'error.main' }} onClick={toggleDoubleCheck}>
            <DeleteIcon />
          </IconButton>
          <Typography variant='body2'>{importPath}</Typography>
        </Stack>
      )}

      {snackbar.element}
    </Box>
  );
};
