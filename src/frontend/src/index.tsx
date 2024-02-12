import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import { BrowserRouter, Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";

import {
  QueryClient,
  QueryClientProvider,
} from "react-query";
import DailyReport from './routes/DailyReport';
import Root from './routes/Root';
import Profile from './routes/Profile';
import Navigation from './components/Navigation';
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/profile",
        element: <Profile/>
      },
      {
        path: "*",
        element: <Root />
      },
      {
        path: "dailyReport/:date",
        element: <DailyReport />,
        loader: (params: any) => {
          return params.params.date
        }
      }
    ]
  },
  
]);
function App() {
  return (
    <><Navigation /><Outlet /></>
  )
}
const queryClient = new QueryClient();
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      
      <RouterProvider router={router}/>
    </QueryClientProvider>


  </React.StrictMode>
);
