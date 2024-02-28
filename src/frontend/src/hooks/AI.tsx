import { useMutation, useQuery } from "react-query"
import { toShortISODate } from "../components/utilities"


const PERSONAL_SECRET = localStorage.getItem("API_SECRET")
const baseApi = 'https://j36jvcdbxaumnmb7odfz64rjoa0ozyzj.lambda-url.us-east-1.on.aws'
export function GetThread(userID: number){
  return useQuery(`thread_${userID}`, async () => {
    const url = new URL(`${baseApi}/threads`)

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
    return result
  })
}

export function GetDayFeedback(date: Date){
  const strDate = toShortISODate(date)
  return useQuery(`dayFeedback_${strDate}`, async () => {
    const url = new URL(`${baseApi}/ai_day_feedback`)
    url.searchParams.append("date", strDate)
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
    return result
  })
}

export function GetDayWorkout(date: Date, timeOfDay: string){
  const strDate = toShortISODate(date)
  return useQuery(`dayWorkout_${strDate}`, async () => {
    const url = new URL(`${baseApi}/ai_workout`)
    url.searchParams.append("date", strDate)
    url.searchParams.append("timeOfDay", timeOfDay)
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
    return result
  })
}


export function ExecutePrompt() {
    return useMutation({
        mutationKey: "prompt",
        mutationFn: async (prompt) => {
            const url = new URL(`${baseApi}/prompt`)
            const response = await fetch(url, {
                headers: {
                    "authorization": `Bearer ${PERSONAL_SECRET}`
                },
                body: JSON.stringify(prompt),
                method: "POST"
            })
            const result = await response.json()
            console.log(result)
            return result
        }
    })
}