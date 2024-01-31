import { insertGoal } from "../common/db/goals/insert.mjs"
import { selectPushSubscription } from "../common/db/pushSubscription/select.mjs"
import { generateDailyReport } from "../common/report.mjs"
import { sendPushNotification } from "../common/webpush.mjs"
import { GoalType } from "../common/db/goals/types.mjs"

export const handler = async () => {
    const {title, body} = await generateDailyReport()
    const subscription = await selectPushSubscription()
    await sendPushNotification(title, body, subscription)
}

await handler()