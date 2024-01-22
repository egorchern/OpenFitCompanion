import React from 'react';
import DataGraph from './components/dataGraph';
import { HealthDataType } from './components/types';
import {
  useQuery,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "react-query";
import { getDateOffset } from './components/utilities';

const queryClient = new QueryClient();
const PAST_DAYS_N = 7
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DataGraph
        type={HealthDataType.Activity}
        startDate={getDateOffset(new Date(), -PAST_DAYS_N)}
        interval={PAST_DAYS_N}
        propertyName='moderateActivity'
      />
    </QueryClientProvider>


  );
}

export default App;
