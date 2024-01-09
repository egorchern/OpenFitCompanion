import { OuraAdapter } from "./adapters/oura.mjs";
import { WithingsAdapter } from "./adapters/withings.mjs";
import { ActivityData, Provider, ProviderAdapter, SleepData } from "./types.mjs";

class Adapter implements ProviderAdapter {
    concrete: ProviderAdapter;
    constructor(provider: Provider) {
        switch (provider) {
            case Provider.Withings:{
                this.concrete = new WithingsAdapter();
                break
            }
            case Provider.Oura: {
                this.concrete = new OuraAdapter();
                break
            }
            default: this.concrete = new WithingsAdapter();
        }
    }
    getDailyAggregatedActivity(startDate: string, endDate: string): ActivityData {
        return this.concrete.getDailyAggregatedActivity(startDate, endDate);
    }
    getDailySleepSummary(startDate: string, endDate: string): SleepData {
        return this.concrete.getDailySleepSummary(startDate, endDate);
    }
}