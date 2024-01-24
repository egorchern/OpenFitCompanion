import { exportHealthData } from "common/export.mjs";
import { queryHealthData } from "../common/db/healtData/query.mjs";
import { selectHealthData } from "../common/db/healtData/select.mjs";
import { HealthDataType } from "../common/db/healtData/types.mjs";
import { HealthData, Provider } from "../common/types.mjs";

// const getDataBetween = async (startDate: string, endDate: string): Promise<[HealthData]> => {
//     return selectHealthData()
// }
const providers = [Provider.Oura, Provider.Withings, Provider.Unified]
const getHealthDataInRange = async (startDate: string, endDate: string, type: HealthDataType) => {
    return Promise.all(providers.map(async (provider) => {
        return {provider: provider, data: await queryHealthData(startDate, endDate, type, provider)}
    }))
    
}

export const handler = async (event: any) => {
    if (typeof event === 'string') {
        event = JSON.parse(event);
    }
    console.log(event)
    const method = event?.requestContext?.http?.method
    const path = event?.requestContext?.http?.path
    const secret = event?.headers?.authorization
    const referenceSecret = `Bearer ${process.env.PERSONAL_SECRET}`
    if (!method || !path || !secret || secret !== referenceSecret) {
        return {
            statusCode: 400
        }
    }
    if (method === "GET") {
        switch (path) {
            case ("/activity"): 
            case ("/sleep"): {
                const startDate = event?.queryStringParameters?.startdate
                const endDate = event?.queryStringParameters?.enddate
                const data = await getHealthDataInRange(startDate, endDate, path.slice(1) as HealthDataType)
                return {
                    statusCode: 200,
                    body: JSON.stringify(data)
                }
            }
            case ("/export"): {
                const downloadUrl = await exportHealthData()
                return {
                    statusCode: 200,
                    body: JSON.stringify({
                        "URL": downloadUrl
                    })
                }
            }
            default: {
                return {
                    statusCode: 400
                }
            }
        }
    }

};
// await handler({
//     queryStringParameters: {
//         startdate: "2024-01-10",
//         enddate: "2024-01-20"
//     },
//     requestContext: {
//         http: {
//             method: "GET",
//             path: "/activity"
//         }
//     },
//     headers: {
//         authorization: `Bearer ${process.env.PERSONAL_SECRET}`
//     }
// })