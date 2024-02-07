import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import {
  useQuery,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "react-query";
import { dataGraphProps, apiData, HealthDataType, Provider } from './types';
import { off } from 'process';
import { getDateOffset, toShortISODate } from './utilities';
import { QueryHealthData } from '../hooks/queryHealthData';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);




const providerToColor: any = {}
providerToColor[Provider.Oura] = "rgb(255, 99, 132)"
providerToColor[Provider.Withings] = "rgb(53, 162, 235)"
providerToColor[Provider.Unified] = "rgb(20, 225, 129)"

export default function DataGraph(props: dataGraphProps) {
  
  const {type, startDate, interval, propertyName} = props
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `${type} : ${propertyName} in past ${interval} days`,
      },
    },
    scales: {
      y: {
        min: 0,
        title: {
          display: true,
          text: propertyName,
          
        }
      },
      x: {
        title: {
          display: true,
          text: "Date",
          
        }
      }
    }
  };
  const queryClient = useQueryClient();
  const endDate = getDateOffset(startDate, interval)
  
  const {status, data, error, isFetching } = QueryHealthData(toShortISODate(startDate), toShortISODate(endDate), type);
  const graphData = useMemo(() => {
    if (error || status !== "success" || !data){
      return {}
    }
    const refDate = new Date(data[0].data[0].Date)
    const dateRange = Array.from(Array(interval).keys()).map((offset) => {
      return toShortISODate(getDateOffset(refDate, offset))
    })
   
    return {
      labels: dateRange,
      datasets: data.map((value: any) => {
        return {
          data: value.data.map((datum: any) => {
            return {
              x: datum.Date,
              y: datum[propertyName]
            }
          }),
          label: value.provider,
          borderColor: providerToColor[value.provider],
          backgroundColor: providerToColor[value.provider],
          spanGaps: true
        }
        
        
      })
    }
  }, [data, status, error, interval, propertyName])
  return (
    <div className='full-width'>
      {status === 'success' ? 
        (
          <Line
            options={options}
            data={graphData as any} 
          />
        ) : null
      }
      {
        error ? (
          <span>
            {String(error)}
          </span>
        ) : null
      }
      
    </div>
  )
}