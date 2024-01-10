import { getDailyAggregatedActivity } from "../api_requests/withings/activity/index.mjs";
import { ActivityData, HealthData, Provider, ProviderAdapter, SleepData } from "../types.mjs";
import { getDailySleepSummary } from "../api_requests/withings/sleep/index.mjs";
import { notificationCategory } from "../api_requests/withings/notify/types.mjs";

export class WithingsAdapter implements ProviderAdapter {
    async getDailyAggregatedActivity(date: string): Promise<ActivityData> {
        const apiData = (await getDailyAggregatedActivity(date, date))[0];
        return {
            caloriesBurned: apiData.calories,
            steps: apiData.steps,
            softActivity: apiData.soft,
            moderateActivity: apiData.moderate,
            intenseActivity: apiData.intense,
            provider: Provider.Withings
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
            sleepEfficiency: apiData.data.sleep_efficiency,
            provider: Provider.Withings
        }
    }
    async processNotification(obj: any): Promise<HealthData> {
        
        const appli = Number(obj.appli);
        let date;
        switch (appli) {
            case notificationCategory.Activity: {
                date = obj.date ?? ""
                const data = await this.getDailyAggregatedActivity(date);
                return data;
            }
            case notificationCategory.Sleep: {
                const startEpoch = obj.startdate ?? ""
                date = new Date(Number(startEpoch) * 1000).toISOString().slice(0, 10)
                const data = await this.getDailySleepSummary(date)
                return data
            }
            default: {
                throw new Error(`${obj} not valid`);
            }
        }

    }
    processPOST (message: any): any {
        
    }
}