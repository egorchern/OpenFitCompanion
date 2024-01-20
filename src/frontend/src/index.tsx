import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Line } from 'react-chartjs-2';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
