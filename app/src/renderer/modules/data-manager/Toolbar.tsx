import React, { useEffect } from 'react';

import SettingsIcon from '@mui/icons-material/Settings';
import { Stack } from '@mui/material';

import { MenuList } from '@components/MenuList';

import ImportButton from './components/ImportButton';
import DropDataFrameButton from './components/DropDataFrameButton';
import DropCheckedButton from './components/DropCheckedButton';
import ScalingHandler from './components/ScalingHandler';
import DecimalsHandler from './components/DecimalsHandler';
import DropNA from './components/DropNA';

const VerticalLine = <Stack sx={{ m: 1, bgcolor: 'grey.700', p: 0.1 }}></Stack>;

export const Toolbar: React.FC = () => {
  const [small, setSmall] = React.useState(false);
  const containerRef = React.useRef();

  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      if (entries.length === 0) return;

      const container = entries[0];

      setSmall(container.contentRect.width < 860);
    });

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [setSmall]);

  return (
    <Stack sx={{ p: 2, gap: 1 }} direction='row' ref={containerRef}>
      <ImportButton />
      <DropDataFrameButton />
      <DropCheckedButton />
      {small ? (
        <MenuList
          title={'Settings'}
          startIcon={<SettingsIcon />}
          items={[<DropNA key={0} />, <ScalingHandler key={1} />, <DecimalsHandler key={2} />]}
        />
      ) : (
        <>
          {VerticalLine}
          <DropNA />
          {VerticalLine}
          <ScalingHandler />
          {VerticalLine}
          <DecimalsHandler />
        </>
      )}
    </Stack>
  );
};
