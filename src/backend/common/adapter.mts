import { OuraAdapter } from "./adapters/oura.mjs";
import { WithingsAdapter } from "./adapters/withings.mjs";
import { ActivityData, Provider, ProviderAdapter, SleepData } from "./types.mjs";

export const getAdapter = (provider: Provider): ProviderAdapter => {
    switch (provider) {
        case Provider.Withings: {
            return new WithingsAdapter();
        }
        case Provider.Oura: {
            return new OuraAdapter();
        }
        default: return new WithingsAdapter();
    }
}

// const ouraAdapter = getAdapter(Provider.Oura);
// const withingsAdapter = getAdapter(Provider.Withings)
// console.log(await ouraAdapter.getDailySleepSummary("2024-01-10"))
// console.log(await withingsAdapter.getDailySleepSummary("2024-01-10"))