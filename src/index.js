import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { DialogContextProvider } from './context/Dialog/DialogProvider';
import { OverlayProvider } from './context/Overlay/OverlayProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <DialogContextProvider forward_history>
        <OverlayProvider>
          <App />
        </OverlayProvider>
      </DialogContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
