import React from 'react';
import DataGraph from './components/dataGraph';
import { HealthDataType } from './components/types';
import {
  useQuery,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "react-query";

const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DataGraph
        type={HealthDataType.Activity}
      />
    </QueryClientProvider>


  );
}

export default App;
