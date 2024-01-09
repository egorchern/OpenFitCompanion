import { ActivityData, ProviderAdapter, SleepData } from "../types.mjs";

export class WithingsAdapter implements ProviderAdapter {
    getDailyAggregatedActivity (startDate: string, endDate: string): ActivityData {
        return {} as ActivityData;
    }
    getDailySleepSummary(startDate: string, endDate: string): SleepData {
        return {} as SleepData;
    }
}