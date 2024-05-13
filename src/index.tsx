import React from 'react';
import ReactDOM, {Container} from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import OverlayProvider from "./lib/overlay/OverlayProvider";

const root = ReactDOM.createRoot(document.getElementById('root') as Container);
root.render(
  <React.StrictMode>
      <OverlayProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
      </OverlayProvider>
  </React.StrictMode>
);
