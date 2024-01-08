
const baseUrl = 'https://api.ouraring.com/v2/usercollection/daily_sleep';

export const getDailySleepSummary = async (startDate: string, endDate: string) => {
    const accessToken = process.env.OURA_ACCESS_TOKEN ?? ""
    const queryUrl = new URL(baseUrl)
    queryUrl.search = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
    }).toString()
    const response = await fetch(queryUrl, {
        method: "GET",
        headers: new Headers({
            "Authorization": `Bearer ${accessToken}`
        })
    })
    const result = await response.json()
    if (!result?.data[0]){
        throw new Error()
    }

    return {
        score: result.data[0].score,
        ...result.data[0].contributors
    }
}

