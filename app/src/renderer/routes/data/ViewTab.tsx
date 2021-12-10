import React from 'react';

import { Typography } from '@mui/material';
import { DataFrame, DataConfig } from '@renderer/components/DataFrame';

import { useCache } from '@renderer/hooks/useCache';
import { RequestState, useRequest } from '@renderer/hooks/useRequest';

export const ViewTab: React.FC = () => {
  const [pageIndex, setPageIndex] = useCache('data-page-index', 1);
  const [pageSize, setPageSize] = useCache('data-page-size', 25);
  const request = useRequest();
  const [data, setData] = React.useState<DataConfig>({ columns: [], rows: [], totalRows: 0 });

  const importPath = window.sessionStorage.getItem('import-path');
  if (importPath == null || importPath === 'null') return <Typography>No data loaded...</Typography>;

  React.useEffect(() => {
    let active = true;

    request.execute({ method: 'get', url: `/data/page/${pageIndex}/page-size/${pageSize}` }, res => {
      if (!active) return;

      if ('dataframe' in res.data) {
        const dataFrame = res.data.dataframe;
        setData(dataFrame);
      }
    });

    return () => {
      active = false;
    };
  }, [pageIndex, pageSize]);

  return (
    <DataFrame
      loading={request.state === RequestState.Pending}
      currentData={data}
      currentPage={pageIndex}
      rowsPerPage={pageSize}
      onPageChange={newPageIndex => setPageIndex(newPageIndex)}
      onPageSizeChange={newPageSize => {
        setPageSize(newPageSize);
        setPageIndex(0);
      }}
    />
  );
};