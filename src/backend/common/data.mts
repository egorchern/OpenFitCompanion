import { insertHealthData } from "./db/healtData/insert.mjs"
import { selectHealthData } from "./db/healtData/select.mjs"
import { HealthDataType } from "./db/healtData/types.mjs"
import { HealthData, Provider } from "./types.mjs"

const providers = [Provider.Oura, Provider.Withings]
export const unify = async (date: string, type: HealthDataType) => {
    let records: any[] = await Promise.all(providers.map((provider) => {
        try {
            return selectHealthData(date, type, provider, true)
        }
        catch (err) {
            console.log(err)
            return null
        }

    }))
    records = records.filter((value) => value)
    const N = records.length
    // Can only unify if there are more than 1 records for same provider+date
    if (N < 2) {
        return
    }
    const runningTotals: any = {}
    runningTotals.provider = Provider.Unified
    runningTotals.date = date
    runningTotals.type = type
    const counts: any = {}
    for (let i = 0; i < N; i++) {
        const record = records[i];
        Object.keys(record).forEach((key: any) => {
            const value = record[key]
            // should only average out numerical attributes
            if (value === undefined || value === null || typeof value !== 'number' || Number.isNaN(value)) {
                return
            }
            if (!runningTotals[key]) {
                runningTotals[key] = value
                counts[key] = 1
            } else {
                runningTotals[key] = value + runningTotals[key]
                counts[key]++
            }
            
        })
    }
    Object.keys(runningTotals).forEach((key: any) => {
        const value = runningTotals[key]
        if (value === undefined || value === null || typeof value !== 'number' || Number.isNaN(value)) {
            return
        }
        runningTotals[key] = Number((runningTotals[key] / counts[key]).toFixed(0))
    })
    console.log(runningTotals)
    await insertHealthData(runningTotals as HealthData)

}