import { putHealthData } from "../common/db/healtData/insert.mjs";
import { getDailyAggregatedActivity } from "../common/api_requests/activity/index.mjs";
import { notificationCategory } from "../common/api_requests/notify/types.mjs";
import { getDailySleepSummary } from "../common//api_requests/sleep/index.mjs";
const processNotification = async (params: any) => {
    const appli = Number(params.get("appli"));
    let healthData: any = {Type: appli}
    switch (appli){
        case notificationCategory.Activity: {
            const date = params.get("date") ?? ""
            const data = (await getDailyAggregatedActivity(date, date))[0];
            healthData.Date = date;
            healthData.Steps = data.steps;
            healthData.HrAvg = data.hr_average
            healthData.SoftActivity = data.soft
            healthData.ModerateActivity = data.moderate
            healthData.IntenseActivity = data.intense
            
            break;
        }
            
        case notificationCategory.Sleep: {
            const date = params.get("date") ?? ""
            const data = (await getDailySleepSummary(date, date))[0];
            healthData.LightSleepDuration = data.lightsleepduration
            healthData.DeepSleepDuration = data.deepsleepduration
            healthData.WakeUpDuration = data.wakeupduration
            healthData.SleepLatency = data.sleep_latency
            healthData.SleepStart = data.startdate
            healthData.SleepEnd = data.enddate
            break
        }
            


    }
    console.log(healthData)
    // store health data
    await putHealthData("Withings", healthData)
}

export const handler = async (event:any, context:any) =>  {
    if (typeof event === 'string'){
        event = JSON.parse(event);
    }
    const body = event.body;
    const buff =  Buffer.from(body, 'base64');
    const text = buff.toString('utf8');
    const params = new URLSearchParams(text)
    processNotification(params)
    return {
        statusCode: 200
    }
    
}
