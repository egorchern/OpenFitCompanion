import { writeFileSync } from "fs"
import { scanHealthData } from "./db/healtData/scan.mjs"
import { json2csv } from "json-2-csv"
import { getTimestamp } from "./utilities.mjs"


export const exportHealthData = async () => {
    const data = await scanHealthData()
    const csv = await json2csv(data, {
        emptyFieldValue: ""
    })
    writeFileSync(`healthData_${getTimestamp()}.csv`, csv)
    // upload to s3
}

exportHealthData()