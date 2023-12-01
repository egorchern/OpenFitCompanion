import { HealthDataType } from "common/db/healtData/types.mjs";
import { getDailyAggregatedActivity } from "../common/api_requests/activity/index.mjs";
import { notificationCategory } from "../common/api_requests/notify/types.mjs";
import { getDailySleepSummary } from "../common/api_requests/sleep/index.mjs";
import { putHealthData } from "../common/db/healtData/insert.mjs";

export const handler = async (
  event: any,
  context: any
) => {
  for (const record of event.Records) {
    const message: string = JSON.stringify(record.Sns.Message).replaceAll("\"", "");
    console.log(`Processed message ${message}`);
    const params = new URLSearchParams(message)
    await processNotification(params)
  }
};


const processNotification = async (params: any) => {
    const appli = Number(params.get("appli"));
    let healthData: any = {Type: appli}
    let date;
    let type: HealthDataType;
    switch (appli){
        case notificationCategory.Activity: {
            date = params.get("date") ?? ""
            const data = (await getDailyAggregatedActivity(date, date))[0];
            type = HealthDataType.Activity
            healthData.Date = date;
            healthData.Steps = data.steps;
            healthData.HrAvg = data.hr_average
            healthData.SoftActivity = data.soft
            healthData.ModerateActivity = data.moderate
            healthData.IntenseActivity = data.intense
            
            break;
        }
            
        case notificationCategory.Sleep: {
            type = HealthDataType.Sleep
            const startEpoch = params.get("startdate") ?? ""
            date = new Date(Number(startEpoch) * 1000).toISOString().slice(0, 10)
            const data = (await getDailySleepSummary(date, date))[0];
            healthData.LightSleepDuration = data.lightsleepduration
            healthData.DeepSleepDuration = data.deepsleepduration
            healthData.WakeUpDuration = data.wakeupduration
            healthData.SleepLatency = data.sleep_latency
            healthData.SleepStart = data.startdate
            healthData.SleepEnd = data.enddate
            break
        }
        default: {
          throw new Error();
        }
            


    }
    console.log(healthData)
    // store health data
    await putHealthData(date, type, "Withings", healthData)
}