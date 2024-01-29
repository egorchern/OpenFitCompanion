
const baseUrl = 'https://api.ouraring.com/v2/usercollection/sleep';
const scoreUrl = 'https://api.ouraring.com/v2/usercollection/daily_sleep';

const getScore = async (startDate: string, endDate: string) => {
    const accessToken = process.env.OURA_ACCESS_TOKEN ?? ""
    const queryUrl = new URL(scoreUrl)
    queryUrl.search = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
    }).toString()
    const response = await fetch(scoreUrl, {
        method: "GET",
        headers: new Headers({
            "Authorization": `Bearer ${accessToken}`
        })
    })
    const result = await response.json()
    if (!result?.data){
        throw new Error()
    }

    return result.data
}

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
    if (!result?.data){
        throw new Error()
    }
    console.log(result.data)
    const scoresObj = await getScore(startDate, endDate)
    const dateToScoreMap = new Map()
    scoresObj.forEach((scoreObj: { score: any, day:string }) => {
        dateToScoreMap.set(scoreObj.day, scoreObj.score)
    });
    result.data.forEach((element: any) => {
        const score = dateToScoreMap.get(element.day)
        if (!score){
            throw new Error("no sleep score for given day")
        }
        element.score = score
    });
   
    
    return result.data
}

