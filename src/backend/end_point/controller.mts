import { queryHealthData } from "../common/db/healtData/query.mjs";
import { selectHealthData } from "../common/db/healtData/select.mjs";
import { HealthDataType } from "../common/db/healtData/types.mjs";
import { HealthData, Provider } from "../common/types.mjs";
import { insertPushSubscription } from "../common/db/pushSubscription/insert.mjs";
import { exportAllHealthData } from "../common/export.mjs";
import { getGoal } from "../common/db/goals/select.mjs";
import { GoalType } from "../common/db/goals/types.mjs";
import { selectUserData } from "../common/db/userData/select.mjs";
import { UserDataType } from "../common/db/userData/types.mjs";
import { insertUserData } from "../common/db/userData/insert.mjs";
import { executePrompt, getDaysFeedback, getThreadMessages} from "../common/assistant.mjs";

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
        case ("/goals"): {
          const goalType = event?.queryStringParameters?.goalType as GoalType
          const data = await getGoal(goalType)
          return {
            statusCode: 200,
            body: JSON.stringify(data)
          }
        }
        case ("/profile"): {
          const data = await selectUserData(UserDataType.Profile)
          return {
            statusCode: 200,
            body: JSON.stringify(data)
          }
        }
        case ("/threads"): {
          const data = await getThreadMessages()
          return {
            statusCode: 200,
            body: JSON.stringify(data)
          }
        }
        case ("/ai_day_feedback"): {
          const date = new Date(event?.queryStringParameters?.date)
          const data = await getDaysFeedback(date)
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
          const downloadUrl = await exportAllHealthData()

          return {
            statusCode: 200,
            body: JSON.stringify({
              "URL": downloadUrl
            })
          }
        }
        case ("/pushSubscription"): {
          const subscriptionJSON = event?.body
          if (!subscriptionJSON) {
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
        case ("/profile"): {
          const profileJSON = event?.body
          if (!profileJSON) {
            return {
              statusCode: 400
            }
          }
          const profileObj = JSON.parse(profileJSON)
          await insertUserData(profileObj, UserDataType.Profile)
          return {
            statusCode: 200
          }
        }
        case ("/prompt"): {
          const prompt = event?.body
          await executePrompt(prompt)
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