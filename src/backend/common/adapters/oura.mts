import { getDailySleepSummary } from "../api_requests/oura/sleep/index.mjs";
import { getDailyAggregatedActivity } from "../api_requests/oura/activity/index.mjs";
import { ActivityData, HealthData, Provider, ProviderAdapter, SleepData } from "../types.mjs";
import { notificationCategory } from "common/api_requests/oura/notify/types.mjs";

export class OuraAdapter implements ProviderAdapter {
    async getDailyAggregatedActivity (date: string): Promise<ActivityData> {
        const curDate = new Date(date)
        let nextDate = curDate
        nextDate.setDate(curDate.getDate() + 1)
        const apiData = (await getDailyAggregatedActivity(date, nextDate.toISOString().slice(0, 10)))[0];
        return {
            caloriesBurned: apiData.active_calories,
            steps: apiData.steps,
            softActivity: apiData.low_activity_time,
            moderateActivity: apiData.medium_activity_time,
            intenseActivity: apiData.high_activity_time,
            provider: Provider.Oura
        }
    }
    async getDailySleepSummary(date: string): Promise<SleepData> {
        const curDate = new Date(date)
        let nextDate = curDate
        nextDate.setDate(curDate.getDate() + 1)
        const apiData = (await getDailySleepSummary(date, nextDate.toISOString().slice(0, 10)))[0]
        return {
            bedtimeStart: apiData.bedtime_start,
            bedtimeEnd: apiData.bedtime_end,
            sleepScore: apiData.score,
            lightSleepDuration: apiData.light_sleep_duration,
            deepSleepDuration: apiData.deep_sleep_duration,
            remSleepDuration: apiData.rem_sleep_duration,
            sleepLatency: apiData.latency,
            sleepEfficiency: apiData.efficiency,
            provider: Provider.Oura
        }
    }
    async processNotification(obj: any): Promise<HealthData> {
        const date = obj.date
        const type = obj.data_type
        if (type === notificationCategory.Activity){
            return this.getDailyAggregatedActivity(date)
        }
        else if (type === notificationCategory.Sleep){
            return this.getDailySleepSummary(date)
        }
        else {
            return this.getDailyAggregatedActivity(date)
        }
    }
    processPOST (message: any): any {
        const obj = {
            provider: Provider.Oura,
            date: message.event_time,
            data_type: message.data_type
        }
        return obj;
    }
}