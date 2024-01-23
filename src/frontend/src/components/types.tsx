export const enum HealthDataType {
    Activity = "activity",
    Sleep = "sleep"
}
export interface dataGraphProps{
    type: HealthDataType,
    startDate: Date,
    interval: number,
    propertyName: string
}
export interface apiData{
    provider: Provider,
    data: HealthData[]
}

export interface BaseHealthData {
    provider: Provider,
    type: HealthDataType,
    date: string
}
export class ActivityData implements BaseHealthData{
    caloriesBurned!: number;
    steps!: number;
    softActivity!: number;
    moderateActivity!: number;
    intenseActivity!: number;
    provider!: Provider
    type!: HealthDataType
    date!: string;
}
export class SleepData implements BaseHealthData{
    bedtimeStart!: number;
    bedtimeEnd!: number;
    sleepScore!: number;
    lightSleepDuration!: number;
    deepSleepDuration!: number;
    remSleepDuration!: number;
    sleepLatency!: number;
    sleepEfficiency!: number;
    provider!: Provider;
    type!: HealthDataType
    date!: string;
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