import { getAccessToken } from "../tokens/tokens.mjs"
const WithingsMeasureUrl = "https://wbsapi.withings.net/v2/measure"

export const getDailyAggregatedActivity = async (accessToken: string, startDate: string, endDate: string) => {
    const queryUrl = new URL(WithingsMeasureUrl)
    queryUrl.search = new URLSearchParams({
        action: "getactivity",
        startdateymd: startDate,
        enddateymd: endDate,
    }).toString()
    queryUrl.search += "&data_fields=steps,hr_average,soft,moderate,intense,calories,hr_zone_2,hr_zone_1,hr_zone_0"
    const response = await fetch(queryUrl, {
        method: "POST",
        headers: new Headers({
            "Authorization": `Bearer ${accessToken}`
        })
    })
    const result = await response.json()
    
    if (!result?.body?.activities){
        throw new Error(`${result}`)
    }
    return result.body.activities
}

