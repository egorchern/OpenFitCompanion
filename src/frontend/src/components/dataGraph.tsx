import React from 'react';
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
import { dataGraphProps } from './types';
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
function useData(){
  return useQuery("healthData", async () => {
    const url = new URL(`${baseApi}/activity`)
    url.searchParams.set("date", "2024-01-18")
    const response = await fetch(url, {
      headers: {
        "authorization": `Bearer ${PERSONAL_SECRET}`
      },
      method: "GET"
    })
    const result = await response.json()
    console.log(result)
  })
}
const baseApi = 'https://j36jvcdbxaumnmb7odfz64rjoa0ozyzj.lambda-url.us-east-1.on.aws'

export default function DataGraph(props: dataGraphProps) {
  const queryClient = useQueryClient();
  const { status, data, error, isFetching } = useData();
  
  const { type } = props
  return (
    <div>
      
    </div>
  )
}