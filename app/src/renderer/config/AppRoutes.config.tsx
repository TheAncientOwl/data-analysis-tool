import React from 'react';

import TableViewIcon from '@mui/icons-material/TableView';
import SettingsInputComponentIcon from '@mui/icons-material/SettingsInputComponent';

import DataManager from '@renderer/components/data-manager';
import { PrincipalComponentsAnalysis } from '@src/renderer/modules/pca';

interface Route {
  name: string;
  alias: string;
  routePath: string;
  element: React.ReactElement<unknown, string | React.JSXElementConstructor<unknown>>;
  icon: React.ReactNode;
}

export const AppRoutes: ReadonlyArray<Route> = [
  { name: 'data manager', alias: 'data manager', routePath: '/', element: <DataManager />, icon: <TableViewIcon /> },
  {
    name: 'principal components analysis',
    alias: 'PCA',
    routePath: '/pca',
    element: <PrincipalComponentsAnalysis />,
    icon: <SettingsInputComponentIcon />,
  },
];
