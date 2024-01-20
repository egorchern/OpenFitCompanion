import { selectHealthData } from "common/db/healtData/select.mjs";
import { HealthDataType } from "common/db/healtData/types.mjs";
import { HealthData, Provider } from "common/types.mjs";

// const getDataBetween = async (startDate: string, endDate: string): Promise<[HealthData]> => {
//     return selectHealthData()
// }
const providers = [Provider.Oura, Provider.Withings, Provider.Unified]
const getHealthData = async (date: string, type: HealthDataType): Promise<HealthData[]> => {
    return Promise.all(providers.map((provider) => {
        return selectHealthData(date, type, provider, true)
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
            case ("/activity"): {
                const date = event?.queryStringParameters?.date
                const data = await getHealthData(date, HealthDataType.Activity)
                console.log(data)
                return {
                    statusCode: 200,
                    body: JSON.stringify(data)
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
