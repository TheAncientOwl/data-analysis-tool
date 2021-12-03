import { contextBridge, ipcRenderer } from 'electron';
import { dialog } from '@electron/remote';

const showOpenCsvDialog = async (): Promise<string | null> => {
  const value = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'Csv', extensions: ['csv'] }],
  });

  if (value.canceled) return null;

  return value.filePaths[0];
};

const showOpenDirectoryDialog = async (): Promise<string | null> => {
  const value = await dialog.showOpenDialog({
    properties: ['openDirectory'],
  });

  if (value.canceled) return null;

  return value.filePaths[0];
};

const minimizeAppWindow = () => {
  ipcRenderer.invoke('window-minimize');
};

const toggleMaximizeAppWindow = () => {
  ipcRenderer.invoke('window-toggle-maximize');
};

const closeAppWindow = () => {
  ipcRenderer.invoke('window-close');
};

contextBridge.exposeInMainWorld('electron', {
  showOpenCsvDialog,
  showOpenDirectoryDialog,
  minimizeAppWindow,
  toggleMaximizeAppWindow,
  closeAppWindow,
});

export {};
declare global {
  interface Window {
    electron: {
      showOpenCsvDialog: () => Promise<string | null>;
      showOpenDirectoryDialog: () => Promise<string | null>;
      minimizeAppWindow: () => void;
      toggleMaximizeAppWindow: () => void;
      closeAppWindow: () => void;
    };
  }
}
