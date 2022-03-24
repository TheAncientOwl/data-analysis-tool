import React from 'react';

import TableViewIcon from '@mui/icons-material/TableView';

import { DataManager } from '@renderer/components/data-manager/DataManager';
// import { Data } from '@renderer/components/data/Data';

interface Route {
  name: string;
  routePath: string;
  element: React.ReactElement<unknown, string | React.JSXElementConstructor<unknown>>;
  icon: React.ReactNode;
}

export const AppRoutes: ReadonlyArray<Route> = [
  { name: 'data', routePath: '/', element: <DataManager />, icon: <TableViewIcon /> },
];
