import { selectPushSubscription } from "../common/db/pushSubscription/select.mjs"
import { generateDailyReport, generateRefreshReminder } from "../common/report.mjs"
import { sendPushNotification } from "../common/webpush.mjs"
import { toShortISODate } from "../common/utilities.mjs"
import { ReportType } from "../common/types.mjs"
import { sendAIData } from "../common/assistant.mjs"
const baseUrl = 'https://openfitcompanion.xyz'
export const handler = async (ev: any) => {
    const type = ev.ReportType
    switch (type){
        case (ReportType.DAILY): {
            await sendAIData(new Date());
            const {title, body} = await generateDailyReport()
            console.log(body)
            const subscription = await selectPushSubscription()
            const curDate = toShortISODate(new Date())
            const url = `${baseUrl}/dailyReport/${curDate}`
            await sendPushNotification(title, body, url, subscription)
            break;
        }
        case (ReportType.REFRESH_REMINDER): {
            const {title, body} = await generateRefreshReminder()
            console.log(body)
            const subscription = await selectPushSubscription()
            await sendPushNotification(title, body, baseUrl, subscription)
        }
    }
    
}

