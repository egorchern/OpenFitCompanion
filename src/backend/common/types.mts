import { HealthDataType } from "./db/healtData/types.mjs";

export interface BaseHealthData {
    provider: Provider,
    type: HealthDataType,
    date: string
}
export interface ActivityData extends BaseHealthData{
    caloriesBurned: number,
    steps: number,
    softActivity: number,
    moderateActivity: number,
    intenseActivity: number,
    provider: Provider
}
export interface SleepData extends BaseHealthData{
    bedtimeStart: number,
    bedtimeEnd: number,
    sleepScore: number,
    lightSleepDuration: number,
    deepSleepDuration: number,
    remSleepDuration: number,
    sleepLatency: number,
    sleepEfficiency: number,
    provider: Provider
}
export const enum Provider {
    Oura = "Oura",
    Withings = "Withings",
    Unified = "Unified"
}
export type HealthData = SleepData | ActivityData;
export interface ProviderAdapter {
    getDailyAggregatedActivity: (date: string) => Promise<ActivityData>,
    getDailySleepSummary: (date: string) => Promise<SleepData>,
    processNotification: (obj: any) => Promise<HealthData>,
    processPOST: (message: any) => any
}