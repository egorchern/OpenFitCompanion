import { queryHealthData } from "../common/db/healtData/query.mjs";
import { selectHealthData } from "../common/db/healtData/select.mjs";
import { HealthDataType } from "../common/db/healtData/types.mjs";
import { HealthData, Provider } from "../common/types.mjs";
import { insertPushSubscription } from "../common/db/pushSubscription/insert.mjs";
import { exportHealthData } from "../common/export.mjs";

const providers = [Provider.Oura, Provider.Withings, Provider.Unified]
const getHealthDataInRange = async (startDate: string, endDate: string, type: HealthDataType) => {
  return Promise.all(providers.map(async (provider) => {
    return { provider: provider, data: await queryHealthData(startDate, endDate, type, provider) }
  }))

}

export const handleRequest = async (method: string, path: string, event: any) => {
    console.log(method, path, event)
    switch (method) {
      case ("GET"): {
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
  
          default: {
            return {
              statusCode: 400
            }
          }
        }
      }
      case ("POST"): {
        switch (path) {
          case ("/export"): {
            const downloadUrl = await exportHealthData()
  
            return {
              statusCode: 200,
              body: JSON.stringify({
                "URL": downloadUrl
              })
            }
          }
          case ("/pushSubscription"): {
            const subscriptionJSON = event?.body
            if (!subscriptionJSON){
                return {
                    statusCode: 400
                }
            }
            const subscriptionObj = JSON.parse(subscriptionJSON) as PushSubscription
            await insertPushSubscription(subscriptionObj)
            return {
                statusCode: 200
            }
          }
        }
  
      }
      default: {
        return {
          statusCode: 400
        }
      }
    }
  }