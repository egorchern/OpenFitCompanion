import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';
import { BrowserRouter, RouterProvider, createBrowserRouter } from "react-router-dom";
import Root from './routes/root';
import Report from './routes/report';

import {
  QueryClient,
  QueryClientProvider,
} from "react-query";
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  {
    path: "*",
    element: <Root />
  },
  {
    path: "dailyReport/:date",
    element: <Report />,
    loader: (params: any) => {
      return params.params.date
    }
  }
]);
const queryClient = new QueryClient();
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>


  </React.StrictMode>
);
