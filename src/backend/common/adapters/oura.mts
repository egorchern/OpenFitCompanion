import { getDailySleepSummary } from "../api_requests/oura/sleep/index.mjs";
import { getDailyAggregatedActivity } from "../api_requests/oura/activity/index.mjs";
import { ActivityData, HealthData, Provider, ProviderAdapter, SleepData } from "../types.mjs";
import { notificationCategory } from "../api_requests/oura/notify/types.mjs";
import { HealthDataType } from "../db/healtData/types.mjs";
import { toShortISODate } from "../utilities.mjs";

export class OuraAdapter implements ProviderAdapter {
    async getDailyAggregatedActivity (date: string): Promise<ActivityData> {
        const curDate = new Date(date)
        let nextDate = structuredClone(curDate)
        nextDate.setDate(curDate.getDate() + 1)
        const apiData = (await getDailyAggregatedActivity(toShortISODate(curDate), toShortISODate(nextDate)))[0];
        console.log(apiData)
        return {
            caloriesBurned: apiData.active_calories,
            steps: apiData.steps,
            softActivity: apiData.low_activity_time,
            moderateActivity: apiData.medium_activity_time,
            intenseActivity: apiData.high_activity_time,
            provider: Provider.Oura,
            type: HealthDataType.Activity,
            date: toShortISODate(curDate)
        }
    }
    async getDailySleepSummary(date: string): Promise<SleepData> {
        const curDate = new Date(date)
        let nextDate = structuredClone(curDate)
        nextDate.setDate(curDate.getDate() + 1)
        const apiData = (await getDailySleepSummary(toShortISODate(curDate), toShortISODate(nextDate)))[0]
        console.log(apiData)
        const bedtimeStart = Math.floor(new Date(apiData.bedtime_start).getTime() / 1000)
        const bedtimeEnd = Math.floor(new Date(apiData.bedtime_end).getTime() / 1000)
        const totalSleepDuration = Math.floor((bedtimeEnd - bedtimeStart) / 60 / 60)
        return {
            bedtimeStart: bedtimeStart,
            bedtimeEnd: bedtimeEnd,
            sleepScore: apiData.score,
            lightSleepDuration: apiData.light_sleep_duration,
            deepSleepDuration: apiData.deep_sleep_duration,
            remSleepDuration: apiData.rem_sleep_duration,
            sleepLatency: apiData.latency,
            sleepEfficiency: apiData.efficiency,
            provider: Provider.Oura,
            type: HealthDataType.Sleep,
            date: toShortISODate(curDate),
            totalSleepDuration: totalSleepDuration
        }
       
    }
    async processNotification(obj: any): Promise<HealthData> {
        const date = obj.date
        const type = obj.data_type
        if (type === notificationCategory.Activity){
            return this.getDailyAggregatedActivity(date)
        }
        else if (type === notificationCategory.Sleep || type === notificationCategory.Daily_Sleep){
            return this.getDailySleepSummary(date)
        }
        else {
            return this.getDailyAggregatedActivity(date)
        }
    }
    processPOST (message: any): any {
        const parsed = JSON.parse(message)
        const obj = {
            provider: Provider.Oura,
            date: parsed.event_time,
            data_type: parsed.data_type
        }
        return obj;
    }
}