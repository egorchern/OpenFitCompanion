export interface ActivityData {
    caloriesBurned: number,
    steps: number,
    softActivity: number,
    moderateActivity: number,
    intenseActivity: number,
    provider: Provider
}
export interface SleepData {
    bedtimeStart: string,
    bedtimeEnd: string,
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
    Withings = "Withings"
}
export type HealthData = SleepData | ActivityData;
export interface ProviderAdapter {
    getDailyAggregatedActivity: (date: string) => Promise<ActivityData>,
    getDailySleepSummary: (date: string) => Promise<SleepData>,
    processNotification: (obj: any) => Promise<HealthData>,
    processPOST: (message: any) => any
}