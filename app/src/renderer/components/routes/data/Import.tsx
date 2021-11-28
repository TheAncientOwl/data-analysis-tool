import React, { useState } from 'react';
import { axios } from '@renderer/config';

import { Box, Button, Chip, IconButton, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import { RequestState } from '@renderer/misc';
import { useLocalStorage } from '@renderer/hooks/useLocalStorage';
import { useSnackbar } from '@renderer/hooks/useSnackbar';

import { DoubleCheck } from '@renderer/components/DoubleCheck';

export const Import: React.FC = () => {
  const [importPath, setImportPath] = useLocalStorage<string | null>('import-path', null);
  const [dataLoaded, setDataLoaded] = useState<RequestState>(RequestState.None);
  const [doubleCheckOpen, setDoubleCheckOpen] = useState(false);
  const snackbar = useSnackbar({
    title: 'Success',
    message: 'Data deleted!',
    severity: 'success',
    variant: 'filled',
  });

  const importData = async () => {
    const filePath = await window.electronAPI.showOpenCsvDialog();

    if (filePath === null) return;

    setImportPath(filePath);
    setDataLoaded(RequestState.Pending);

    axios.get(`/data/import/csv/${filePath}`).then(() => {
      setDataLoaded(RequestState.Solved);

      snackbar.setMessage('Data loaded!');
      snackbar.open();
    });
  };

  const triggerDoubleCheck = () => setDoubleCheckOpen(true);
  const closeDoubleCheck = () => setDoubleCheckOpen(false);

  const cancelDeleteData = () => {
    closeDoubleCheck();
  };

  const deleteData = () => {
    setDataLoaded(RequestState.Pending);
    axios.get('/data/delete').then(() => {
      setImportPath(null);
      setDataLoaded(RequestState.None);

      snackbar.setMessage('Data deleted!');
      snackbar.open();
    });
    closeDoubleCheck();
  };

  return (
    <Box>
      <DoubleCheck
        open={doubleCheckOpen}
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
        {dataLoaded === RequestState.Pending && (
          <CircularProgress sx={{ ml: 2 }} size={30} thickness={4} color='info' />
        )}
      </Box>

      {importPath !== null && (
        <Box>
          <IconButton sx={{ color: 'error.main' }} onClick={triggerDoubleCheck}>
            <DeleteIcon />
          </IconButton>
          <Chip sx={{ px: 0.7, py: 1.8 }} size='small' color='info' variant='outlined' label={importPath} />
        </Box>
      )}

      {snackbar.element}
    </Box>
  );
};
