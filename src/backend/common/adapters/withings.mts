import { getDailyAggregatedActivity } from "../api_requests/withings/activity/index.mjs";
import { ActivityData, ProviderAdapter, SleepData } from "../types.mjs";
import { getDailySleepSummary } from "../api_requests/withings/sleep/index.mjs";

export class WithingsAdapter implements ProviderAdapter {
    async getDailyAggregatedActivity (date: string): Promise<ActivityData> {
        const apiData = (await getDailyAggregatedActivity(date, date))[0];
        return {
            caloriesBurned: apiData.calories,
            steps: apiData.steps,
            softActivity: apiData.soft,
            moderateActivity: apiData.moderate,
            intenseActivity: apiData.intense
        }
    }
    async getDailySleepSummary(date: string): Promise<SleepData> {
        const apiData = (await getDailySleepSummary(date, date))[0]
        
        return {
            bedtimeStart: new Date(apiData.startdate * 1000).toISOString(),
            bedtimeEnd: new Date(apiData.enddate * 1000).toISOString(),
            sleepScore: apiData.data.sleep_score,
            lightSleepDuration: apiData.data.lightsleepduration,
            deepSleepDuration: apiData.data.deepsleepduration,
            remSleepDuration: apiData.data.remsleepduration,
            sleepLatency: apiData.data.sleep_latency,
            sleepEfficiency: apiData.data.sleep_efficiency
        }
    }
}