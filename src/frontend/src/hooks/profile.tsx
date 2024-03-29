import { useMutation, useQuery } from "react-query"


const PERSONAL_SECRET = localStorage.getItem("API_SECRET")
const baseApi = 'https://j36jvcdbxaumnmb7odfz64rjoa0ozyzj.lambda-url.us-east-1.on.aws'
export function QueryProfile(userID: number){
  return useQuery(`profile_${userID}`, async () => {
    const url = new URL(`${baseApi}/profile`)

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

export function MutateProfile() {
    return useMutation({
        mutationKey: "profile",
        mutationFn: async (profileData) => {
            const url = new URL(`${baseApi}/profile`)
            const response = await fetch(url, {
                headers: {
                    "authorization": `Bearer ${PERSONAL_SECRET}`
                },
                body: JSON.stringify(profileData),
                method: "POST"
            })
            const result = await response.json()
            console.log(result)
            return result
        }
    })
}