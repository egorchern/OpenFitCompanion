import { getDailyAggregatedActivity } from "../api_requests/withings/activity/index.mjs";
import { ActivityData, HealthData, Provider, ProviderAdapter, SleepData } from "../types.mjs";
import { getDailySleepSummary } from "../api_requests/withings/sleep/index.mjs";
import { notificationCategory } from "../api_requests/withings/notify/types.mjs";
import { HealthDataType } from "../db/healtData/types.mjs";
import { getAccessToken } from "../api_requests/withings/tokens/tokens.mjs";
import { getRandomInt, sleep } from "../utilities.mjs";


export class WithingsAdapter implements ProviderAdapter {
    authTokenMaxRetries = 3
    async handleAccessToken(){
        let accessToken;
        let retryCnt = 0
        while (retryCnt < this.authTokenMaxRetries){
            try {
                accessToken = await getAccessToken()
            } catch (err) {
                retryCnt++
                await sleep(getRandomInt(800, 1600))
            }
        } 
        if (!accessToken){
            throw new Error ("Withings: too access token many retries")
        }
        return accessToken
    }
    async getDailyAggregatedActivity(date: string): Promise<ActivityData> {
        const accessToken = await this.handleAccessToken()
        const apiData = (await getDailyAggregatedActivity(accessToken, date, date))[0];
        console.log(apiData)
        return {
            caloriesBurned: apiData.calories,
            steps: apiData.steps,
            softActivity: apiData.soft,
            moderateActivity: apiData.moderate,
            intenseActivity: apiData.intense,
            provider: Provider.Withings,
            type: HealthDataType.Activity,
            date: date
        }
    }
    async getDailySleepSummary(date: string): Promise<SleepData> {
        const accessToken = await this.handleAccessToken()
        const apiData = (await getDailySleepSummary(accessToken, date, date))[0]
        const bedtimeStart = apiData.startdate
        const bedtimeEnd = apiData.enddate
        const totalSleepDuration = Math.floor((bedtimeEnd - bedtimeStart) / 60)
        console.log(apiData)
        return {
            bedtimeStart: apiData.startdate,
            bedtimeEnd: apiData.enddate,
            sleepScore: apiData.data.sleep_score,
            lightSleepDuration: apiData.data.lightsleepduration,
            deepSleepDuration: apiData.data.deepsleepduration,
            remSleepDuration: apiData.data.remsleepduration,
            sleepLatency: apiData.data.sleep_latency,
            sleepEfficiency: Number((apiData.data.sleep_efficiency * 100).toFixed(0)),
            provider: Provider.Withings,
            type: HealthDataType.Sleep,
            date: date,
            totalSleepDuration: totalSleepDuration
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
        
        const buff =  Buffer.from(message, 'base64');
        const text = buff.toString('utf8');
        const params = new URLSearchParams(text);
        const obj: any = {
            provider: Provider.Withings
        }
        params.forEach((value, key) => {
            obj[key] = value
        })
        
        return obj
    }
}