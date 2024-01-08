import { getAccessToken } from "../tokens/tokens.mjs"
const WithingsMeasureUrl = "https://wbsapi.withings.net/v2/measure"

export const getDailyAggregatedActivity = async (startDate: string, endDate: string) => {
    const accessToken = await getAccessToken()
    const queryUrl = new URL(WithingsMeasureUrl)
    queryUrl.search = new URLSearchParams({
        action: "getactivity",
        startdateymd: startDate,
        enddateymd: endDate,
    }).toString()
    queryUrl.search += "&data_fields=steps,hr_average,soft,moderate,intense"
    const response = await fetch(queryUrl, {
        method: "POST",
        headers: new Headers({
            "Authorization": `Bearer ${accessToken}`
        })
    })
    const result = await response.json()
    console.log(result)
    if (!result?.body?.activities){
        throw new Error
    }
    return result.body.activities
}

