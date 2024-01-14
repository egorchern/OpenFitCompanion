import { insertHealthData } from "./db/healtData/insert.mjs"
import { selectHealthData } from "./db/healtData/select.mjs"
import { HealthDataType } from "./db/healtData/types.mjs"
import { HealthData, Provider } from "./types.mjs"

const providers = [Provider.Oura, Provider.Withings]
export const unify = async (date: string, type: HealthDataType) => {
    
    const records: any[] = []
    providers.forEach(async (provider) => {
        try {
            const record = await selectHealthData(date, type, provider)
            records.push(record)
        }
        catch {

        }
        
    })
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
            // should only average out numerical attributes
            if (typeof key != 'number' || !record[key]){
                return
            }
            
            runningTotals[key] += record[key] 
        })
    }
    Object.keys(runningTotals).forEach((key: any) => {
        runningTotals[key] = (runningTotals[key] / N).toFixed(0)
    })
    await insertHealthData(runningTotals)

}