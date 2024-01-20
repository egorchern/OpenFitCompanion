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
import { dataGraphProps, apiData, HealthDataType } from './types';
import { off } from 'process';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
};
const PERSONAL_SECRET = localStorage.getItem("PERSONAL_SECRET")
function useData(startDate: string, endDate: string, type: HealthDataType){
  return useQuery("healthData", async () => {
    const url = new URL(`${baseApi}/${type}`)
    url.searchParams.set("startdate", startDate)
    url.searchParams.set("enddate", endDate)
    const response = await fetch(url, {
      headers: {
        "authorization": `Bearer ${PERSONAL_SECRET}`
      },
      method: "GET"
    })
    const result = await response.json()
    console.log(result)
    return result
  })
}
const baseApi = 'https://j36jvcdbxaumnmb7odfz64rjoa0ozyzj.lambda-url.us-east-1.on.aws'

const toShortISODate = (date: Date): string => {
  return date.toISOString().slice(0, 10)
}

const getDateOffset = (startDate: string, offset: number) => {
  let tempDate = new Date(startDate)
  tempDate.setDate(tempDate.getDate() + offset)
  const endDate = toShortISODate(tempDate)
  return endDate
}

export default function DataGraph(props: dataGraphProps) {
  const {type, startDate, interval} = props
  const queryClient = useQueryClient();
  const endDate = getDateOffset(startDate, interval)
  const {status, data, error, isFetching } = useData(startDate, endDate, type);
  
  const propertyName = "sleepScore"
  const graphData = useMemo(() => {
    return status === "success" ? {
      labels: Array.from(Array(interval).keys()).map((offset) => {
        return getDateOffset(startDate, offset)
      }),
      datasets: data.map((value: any) => {
        return {
          data: value.data.map((datum: any) => {
            return datum[propertyName]
          }),
          label: value.provider
        }
        
        
      })
    } : {}
  }, [data, interval, startDate, status])
  return (
    <div>
      {status === 'success' ? 
        (
          <Line
            options={options}
            data={graphData as any} 
          />
        ) : null
      }
      
    </div>
  )
}