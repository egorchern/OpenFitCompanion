import { selectPushSubscription } from "../common/db/pushSubscription/select.mjs"
import { createActivityReminder, generateDailyReport, generateRefreshReminder, generateWeeklyReport } from "../common/report.mjs"
import { sendPushNotification } from "../common/webpush.mjs"
import { toShortISODate } from "../common/utilities.mjs"
import { ReportType } from "../common/types.mjs"
import { refreshAll } from "../common/data.mjs"
const baseUrl = process.env.BASE_URL ?? ""
export const handler = async (ev: any) => {
    const type = ev.reportType
    switch (type){
        case (ReportType.DAILY): {
            await refreshAll(new Date())
            const {title, body} = await generateDailyReport()
            console.log(body)
            const subscription = await selectPushSubscription()
            const curDate = toShortISODate(new Date())
            const url = `${baseUrl}/dailyReport/${curDate}`
            await sendPushNotification(title, body, url, subscription)
            break;
        }
        case (ReportType.WEEKLY): {
            await refreshAll(new Date())
            const {title, body} = await generateWeeklyReport()
            console.log(body)
            const subscription = await selectPushSubscription()
            const curDate = toShortISODate(new Date())
            const url = `${baseUrl}/weeklyReport/${curDate}`
            await sendPushNotification(title, body, url, subscription)
            break;
        }
        case (ReportType.ACTIVITY): {
            await refreshAll(new Date())
            const timeOfDay = ev.timeOfDay
            const {title, body} = await createActivityReminder(timeOfDay)
            const subscription = await selectPushSubscription()
            const curDate = toShortISODate(new Date())
            const url = `${baseUrl}/exercisePlan/${curDate}/${timeOfDay}`
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

