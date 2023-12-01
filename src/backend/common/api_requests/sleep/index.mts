import { getAccessToken } from "../../tokens.mjs"
const baseUrl = "https://wbsapi.withings.net/v2/sleep"

export const getDailySleepSummary = async (startDate: string, endDate: string) => {
    const accessToken = await getAccessToken()
    const queryUrl = new URL(baseUrl)
    queryUrl.search = new URLSearchParams({
        action: "getsummary",
        startdateymd: startDate,
        enddateymd: endDate,
    }).toString()
    queryUrl.search += "&data_fields=lightsleepduration,deepsleepduration,wakeupduration,sleep_latency"
    const response = await fetch(queryUrl, {
        method: "POST",
        headers: new Headers({
            "Authorization": `Bearer ${accessToken}`
        })
    })
    const result = await response.json()
    console.log(result)
    if (!result?.body?.series){
        throw new Error
    }
    return result.body.series
}

