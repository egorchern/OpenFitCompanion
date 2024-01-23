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
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


const PERSONAL_SECRET = localStorage.getItem("PERSONAL_SECRET")
function useData(startDate: string, endDate: string, type: HealthDataType){
  return useQuery(`${type}`, async () => {
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
  }, {
    staleTime: 60000
  })
}
const baseApi = 'https://j36jvcdbxaumnmb7odfz64rjoa0ozyzj.lambda-url.us-east-1.on.aws'
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
  const {status, data, error, isFetching } = useData(toShortISODate(startDate), toShortISODate(endDate), type);
  console.log(data)
  const graphData = useMemo(() => {
    if (status !== "success" || !data){
      return {}
    }
    const refDate = new Date(data[0].data[0].Date)
    return {
      labels: data[0].data.map((v: any, offset: number) => {
        return toShortISODate(getDateOffset(refDate, offset))
      }),
      datasets: data.map((value: any) => {
        return {
          data: value.data.map((datum: any) => {
            return datum[propertyName]
          }),
          label: value.provider,
          borderColor: providerToColor[value.provider],
          backgroundColor: providerToColor[value.provider]
        }
        
        
      })
    }
  }, [data, status, propertyName])
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
            {error as any}
          </span>
        ) : null
      }
      
    </div>
  )
}