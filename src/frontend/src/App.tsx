import React, { useMemo, useState } from 'react';
import DataGraph from './components/dataGraph';
import { ActivityData, HealthDataType, SleepData } from './components/types';
import {
  useQuery,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "react-query";
import { getDateOffset } from './components/utilities';
import Button from '@mui/material/Button';
import '@fontsource/roboto'

const queryClient = new QueryClient();
const PAST_DAYS_N = 7
function App() {
  const [curPropertyName, setCurPropertyName] = useState("");
  const [curDataType, setCurDataType] = useState(HealthDataType.Sleep)
  const sleepPropertyNames = useMemo(() => {
    const temp = new SleepData()
    return Object.keys(temp)

  }, [])
  const activityPropertyNames = useMemo(() => {
    const temp = new ActivityData()
    return Object.keys(temp)

  }, [])
  const handlePropertyBtnClick = (type: HealthDataType, propertyName: string) => {
    if (propertyName === curPropertyName && type === curDataType) {
      return
    }
    setCurDataType(type)
    setCurPropertyName(propertyName)
  }
  return (
    <QueryClientProvider client={queryClient}>
      <div className='flex-vertical'>

        <DataGraph
          type={curDataType}
          startDate={getDateOffset(new Date(), -PAST_DAYS_N)}
          interval={PAST_DAYS_N}
          propertyName={curPropertyName}
        />

        <h3>Activity</h3>
        <div className='flex-horizontal'>
          {
            activityPropertyNames.map((name: string) => {
              return (
                <Button key={name} variant='contained' onClick={() => { handlePropertyBtnClick(HealthDataType.Activity, name) }}>
                  {name}
                </Button>
              )
            })
          }
        </div>
        <h3>Sleep</h3>
        <div className='flex-horizontal'>
          {
            sleepPropertyNames.map((name: string) => {
              return (
                <Button key={name} variant='contained' onClick={() => { handlePropertyBtnClick(HealthDataType.Sleep, name) }}>
                  {name}
                </Button>
              )
            })
          }
        </div>
      </div>


    </QueryClientProvider>


  );
}

export default App;
