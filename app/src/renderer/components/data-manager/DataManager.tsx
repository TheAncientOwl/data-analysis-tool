import React from 'react';

import { Box, Backdrop, CircularProgress, Stack, Typography } from '@mui/material';

import { ActionType, dataManagerStateReducer, getDefaultDataManagerState } from './state';

import { axios } from '@renderer/config';
import { Snackbar } from '@renderer/components/Snackbar';

import { DataManagerContextProvider } from './context';

import { DataFrameViewer } from './data-frame-viewer';
import { DataFrameViewerPagination } from './data-frame-viewer/DataFrameViewerPagination';

import { ImportButton } from './components/ImportButton';
import { DropDataFrameButton } from './components/DropDataFrameButton';
import { DropCheckedButton } from './components/DropCheckedButton';
import { ScalingHandler } from './components/ScalingHandler';
import { DecimalsHandler } from './components/DecimalsHandler';

const noDataLoadedMessageStyles = {
  height: '100%',
  p: 2,
  pt: '5%',
  display: 'flex',
  justifyContent: 'center',
} as const;

const dataFrameWrapperStyles = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  boxSizing: 'border-box',
  p: 1.5,
  pt: 0,
} as const;

const VerticalLine = <Stack sx={{ m: 1, bgcolor: 'grey.700', p: 0.1 }}></Stack>;

export const DataManager: React.FC = () => {
  const [state, dispatch] = React.useReducer(dataManagerStateReducer, getDefaultDataManagerState());

  const fetchData = () => {
    dispatch({ type: ActionType.Loading });

    axios.get(`/data/page/${state.page}/page-size/${state.pageSize}`).then(res => {
      if ('dataframe' in res.data) dispatch({ type: ActionType.DataFetched, payload: res.data.dataframe });
      else dispatch({ type: ActionType.EndLoading });
    });
  };

  const closeFeedbackMessage = () => dispatch({ type: ActionType.CloseFeedbackMessage });

  const handle = React.useMemo(
    () => ({
      pageChange: (newPageIndex: number) => dispatch({ type: ActionType.ChangePage, payload: newPageIndex }),
      pageSizeChange: (newPageSize: number) => dispatch({ type: ActionType.ChangePageSize, payload: newPageSize }),
      labelCheck: (selectedLabel: string) => dispatch({ type: ActionType.CheckLabel, payload: selectedLabel }),
      rowCheck: (selectedRow: number) => dispatch({ type: ActionType.CheckRow, payload: selectedRow }),
    }),
    [dispatch]
  );

  React.useEffect(() => {
    fetchData();
  }, [state.page, state.pageSize]);

  return (
    <DataManagerContextProvider value={{ dispatch, state, fetchData }}>
      <Stack sx={{ p: 2, gap: 1 }} direction='row'>
        <ImportButton />
        <DropDataFrameButton />
        <DropCheckedButton />
        {VerticalLine}
        <ScalingHandler />
        {VerticalLine}
        <DecimalsHandler />
      </Stack>

      {state.dataFrame.totalRows === 0 && <Typography sx={noDataLoadedMessageStyles}>No data loaded...</Typography>}

      {state.dataFrame.totalRows > 0 && (
        <Box sx={dataFrameWrapperStyles}>
          <DataFrameViewer
            dataFrame={state.dataFrame}
            decimalsPrecision={state.decimalsPrecision}
            checkedLabels={state.checkedLabels}
            checkedRows={state.checkedRows}
            onLabelCheck={handle.labelCheck}
            onRowCheck={handle.rowCheck}
          />
          <DataFrameViewerPagination
            totalRows={state.dataFrame.totalRows}
            pageSize={state.pageSize}
            page={state.page}
            onPageChange={handle.pageChange}
            onPageSizeChange={handle.pageSizeChange}
          />
        </Box>
      )}

      <Snackbar open={state.feedbackMessageOpen} onClose={closeFeedbackMessage}>
        {state.feedbackMessage}
      </Snackbar>

      <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={state.loading}>
        <CircularProgress color='inherit' />
      </Backdrop>
    </DataManagerContextProvider>
  );
};
