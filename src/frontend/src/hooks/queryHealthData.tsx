import { useQuery } from "react-query"
import { HealthData, HealthDataType } from "../components/types"

const PERSONAL_SECRET = localStorage.getItem("API_SECRET")
const baseApi = 'https://j36jvcdbxaumnmb7odfz64rjoa0ozyzj.lambda-url.us-east-1.on.aws'
export function QueryHealthData(startDate: string, endDate: string, type: HealthDataType){
  return useQuery(`${type}:${startDate} - ${endDate}`, async () => {
    const url = new URL(`${baseApi}/${type}`)
    url.searchParams.set("startdate", startDate)
    url.searchParams.set("enddate", endDate)
    const response = await fetch(url, {
      headers: {
        "authorization": `Bearer ${PERSONAL_SECRET}`
      },
      method: "GET"
    })
    if (!response.ok){
      console.log("err")
      throw Error("bad token")
    }
    const result = await response.json()
    console.log(JSON.stringify(result[2]))
    return result as any[]
  }, {
    staleTime: 60000,
    retry: 0
  })
}