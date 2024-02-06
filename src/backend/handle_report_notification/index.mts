import { insertGoal } from "../common/db/goals/insert.mjs"
import { selectPushSubscription } from "../common/db/pushSubscription/select.mjs"
import { generateDailyReport } from "../common/report.mjs"
import { sendPushNotification } from "../common/webpush.mjs"
import { GoalType } from "../common/db/goals/types.mjs"
import { toShortISODate } from "common/utilities.mjs"
import { ReportType } from "common/types.mjs"
const baseUrl = 'http://localhost:3000'
export const handler = async (ev: any) => {
    const type = ev.ReportType
    switch (type){
        case (ReportType.DAILY): {
            const {title, body} = await generateDailyReport()
            console.log(body)
            const subscription = await selectPushSubscription()
            const curDate = toShortISODate(new Date())
            const url = `${baseUrl}/dailyReport/${curDate}`
            await sendPushNotification(title, body, url, subscription)
        }
    }
    
}

// await handler()