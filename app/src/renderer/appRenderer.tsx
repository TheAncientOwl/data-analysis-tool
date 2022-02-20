import './app.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';

import { inDev } from '@common/helpers';

import { CssBaseline, ThemeProvider } from '@mui/material';

import { theme } from '@renderer/config';
import { CacheSystem } from '@renderer/api/CacheSystem';
import App from './App';

CacheSystem.Clear();

// Render application in DOM
ReactDOM.render(
  <React.Fragment>
    <CssBaseline />
    <HashRouter>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </HashRouter>
  </React.Fragment>,
  document.getElementById('app')
);

// Hot module replacement
if (inDev() && module.hot) module.hot.accept();
