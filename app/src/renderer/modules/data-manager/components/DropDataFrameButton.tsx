import React from 'react';

import { Box, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

// eslint-disable-next-line import/named
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '@renderer/store';
import { dropDataFrame } from '@renderer/store/data-manager/actions';

import { DoubleCheck } from '@renderer/components/DoubleCheck';
import { useSwitch } from '@renderer/hooks';

const DropDataFrameButton: React.FC<PropsFromRedux> = props => {
  const doubleCheckSwitch = useSwitch();

  const handleDropDataFrame = () => {
    doubleCheckSwitch.off();

    props.dropDataFrame();
  };

  return (
    <>
      <Button
        disabled={props.dataFrame.totalRows === 0}
        onClick={doubleCheckSwitch.on}
        startIcon={<DeleteIcon />}
        size='medium'>
        Delete
      </Button>

      <DoubleCheck
        open={doubleCheckSwitch.value}
        onAccept={{
          title: 'Delete',
          execute: handleDropDataFrame,
        }}
        onReject={{
          title: 'Cancel',
          execute: doubleCheckSwitch.off,
        }}>
        This action will
        <Box component='span' sx={{ color: 'error.main' }}>
          {' delete the Dataframe'}
        </Box>
        <br />
        Are you sure?
      </DoubleCheck>
    </>
  );
};

// <redux>
const mapState = (state: RootState) => ({
  dataFrame: state.dataManager.dataFrame,
});

const mapDispatch = {
  dropDataFrame,
};

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(DropDataFrameButton);
// </redux>
