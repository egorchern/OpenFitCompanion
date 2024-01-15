import { insertHealthData } from "./db/healtData/insert.mjs"
import { selectHealthData } from "./db/healtData/select.mjs"
import { HealthDataType } from "./db/healtData/types.mjs"
import { HealthData, Provider } from "./types.mjs"

const providers = [Provider.Oura, Provider.Withings]
export const unify = async (date: string, type: HealthDataType) => {
    let records: any[] = await Promise.all(providers.map((provider) => {
        try{
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
    if (N < 2){
        return
    }
    const runningTotals = structuredClone(records[0])
    runningTotals.provider = "unified"

    for(let i = 1; i < N; i++){
        const record = records[i];
        Object.keys(record).forEach((key: any) => {
            const value = record[key]
            // should only average out numerical attributes
            if (value === undefined || value === null || typeof value !== 'number' || Number.isNaN(value)){
                return
            }
            runningTotals[key] = value + runningTotals[key]
        })
    }
    Object.keys(runningTotals).forEach((key: any) => {
        const value = runningTotals[key]
        if (value === undefined || value === null || typeof value !== 'number' || Number.isNaN(value)){
            return
        }
        runningTotals[key] = Number((runningTotals[key] / N).toFixed(0))
    })
    await insertHealthData(runningTotals)

}