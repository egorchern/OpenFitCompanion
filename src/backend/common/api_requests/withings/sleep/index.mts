import { getAccessToken } from "../tokens/tokens.mjs"
const baseUrl = "https://wbsapi.withings.net/v2/sleep"

export const getDailySleepSummary = async (accessToken: string, startDate: string, endDate: string) => {
    const queryUrl = new URL(baseUrl)
    queryUrl.search = new URLSearchParams({
        action: "getsummary",
        startdateymd: startDate,
        enddateymd: endDate,
    }).toString()
    queryUrl.search += "&data_fields=lightsleepduration,deepsleepduration,remsleepduration,sleep_score,sleep_latency,sleep_efficiency"
    const response = await fetch(queryUrl, {
        method: "POST",
        headers: new Headers({
            "Authorization": `Bearer ${accessToken}`
        })
    })
    const result = await response.json()
    
    if (!result?.body?.series){
        throw new Error(`${result}`)
    }
    return result.body.series
}

