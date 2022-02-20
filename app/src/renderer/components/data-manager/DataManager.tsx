import React from 'react';

import { Tabs, Tab } from '@mui/material';

import { DataManagerConfig } from './DataManager.config';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      style={{
        flex: 1,
        display: value === index ? 'flex' : 'none',
        flexDirection: 'column',
        boxSizing: 'border-box',
        padding: '16px',
      }}
      role='tabpanel'
      id={`data-tabpanel-${index}`}
      aria-labelledby={`data-tabpanel-${index}`}
      {...other}>
      {value === index && children}
    </div>
  );
};

const a11yProps = (index: number) => {
  return {
    id: `data-tabpanel-${index}`,
    'aria-controls': `data-tabpanel-${index}`,
  };
};

export const DataManager: React.FC = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => setValue(newValue);

  return (
    <React.Fragment>
      <Tabs value={value} onChange={handleChange} aria-label='data tabs'>
        {DataManagerConfig.map((tab, index) => (
          <Tab key={index} icon={tab.icon} iconPosition='start' label={tab.label} {...a11yProps(index)} />
        ))}
      </Tabs>

      {DataManagerConfig.map((tab, index) => (
        <TabPanel key={index} value={value} index={index}>
          {tab.component}
        </TabPanel>
      ))}
    </React.Fragment>
  );
};