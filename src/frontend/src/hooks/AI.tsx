import { useMutation, useQuery } from "react-query"


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
  }, {
    retry: 0
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