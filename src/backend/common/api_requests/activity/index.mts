
import { putToken } from "../../db/tokens/insert.mjs"
import { putHealthData } from "../../db/healtData/insert.mjs"
import { getAccessToken } from "../../tokens.mjs"
import { tokenType } from "../../db/tokens/types.mjs"
const WithingsMeasureUrl = "https://wbsapi.withings.net/v2/measure"

export const getDailyAggregatedActivity = async (startDate: string, endDate: string) => {
    const accessToken = await getAccessToken()
    const queryUrl = new URL(WithingsMeasureUrl)
    queryUrl.search = new URLSearchParams({
        action: "getactivity",
        startdateymd: startDate,
        enddateymd: endDate
    }).toString()
    const response = await fetch(queryUrl, {
        method: "POST",
        headers: new Headers({
            "Authorization": `Bearer ${accessToken}`
        })
    })
    const result = await response.json()
    if (!result?.body?.activities){
        throw new Error
    }
    return result.body.activities
}
