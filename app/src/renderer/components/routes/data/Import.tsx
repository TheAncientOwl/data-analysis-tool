import React, { useState } from 'react';
import { axios } from '@renderer/config';

import {
  Box,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Snackbar,
  Alert,
  AlertTitle,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import { RequestState } from '@renderer/misc';
import { useLocalStorage } from '@renderer/hooks/useLocalStorage';

export const Import: React.FC = () => {
  const [importPath, setImportPath] = useLocalStorage<string | null>('import-path', null);
  const [dataLoaded, setDataLoaded] = useState<RequestState>(RequestState.None);
  const [doubleCheckOpen, setDoubleCheckOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const importData = async () => {
    const filePath = await window.electronAPI.showOpenCsvDialog();

    if (filePath === null) return;

    setImportPath(filePath);
    setDataLoaded(RequestState.Pending);

    axios.get(`/data/import/csv/${filePath}`).then(() => {
      setDataLoaded(RequestState.Solved);
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
      setSnackbarOpen(true);
    });
    closeDoubleCheck();
  };

  const closeSnackbar = () => setSnackbarOpen(false);

  return (
    <Box>
      <Dialog
        open={doubleCheckOpen}
        aria-labelledby='doublecheck-dialog-title'
        aria-describedby='doublecheck-dialog-description'>
        <DialogTitle id='doublecheck-dialog-title'>Double check</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action will{' '}
            <Box component='span' sx={{ color: 'error.main' }}>
              delete
            </Box>{' '}
            the data imported from <Box component='span' sx={{ color: 'info.main' }}>{`"${importPath}"`}</Box>
            <br />
            Are you sure?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={deleteData} variant='outlined' color='error'>
            Delete
          </Button>
          <Button onClick={cancelDeleteData} variant='outlined' color='info'>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

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

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={closeSnackbar}>
        <Alert severity='success' variant='filled' onClose={closeSnackbar}>
          <AlertTitle>Success</AlertTitle>
          Data deleted!
        </Alert>
      </Snackbar>
    </Box>
  );
};