import { useQuery } from "react-query"
import { GoalType, HealthData, HealthDataType } from "../components/types"

const PERSONAL_SECRET = localStorage.getItem("API_SECRET")
const baseApi = 'https://j36jvcdbxaumnmb7odfz64rjoa0ozyzj.lambda-url.us-east-1.on.aws'
export function GetGoal(goalType: GoalType){
  return useQuery(`goal_${goalType}`, async () => {
    const url = `${baseApi}/goals?goalType=${goalType}`
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
    console.log(result)
    return result as any
  }, {
    staleTime: 60000,
    retry: 0
  })
}