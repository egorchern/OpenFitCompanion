import { getGoal } from "./db/goals/select.mjs";
import { Goal, GoalType } from "./db/goals/types.mjs";
import { queryHealthData } from "./db/healtData/query.mjs";
import { selectHealthData } from "./db/healtData/select.mjs";
import { HealthDataType } from "./db/healtData/types.mjs";
import { ActivityData, Provider, SleepData } from "./types.mjs";
import { getMonday, toShortISODate } from "./utilities.mjs";
const getScoreEmoji = (score: number) => {
    const scorePointsToEmoji: any = {
        30: "😡",
        55: "😐",
        70: "🙂",
        85: "😊",
        100: "😍"
    }
    const thresholds = Object.keys(scorePointsToEmoji)
    for (let i = 0; i < thresholds.length; i++) {
        const threshold = Number(thresholds[i])
        if (score <= threshold) {
            return scorePointsToEmoji[threshold]
        }
    }
    return scorePointsToEmoji[thresholds[thresholds.length - 1]]

}

const intensityMETWeights = {
    softActivity: 1.75,
    moderateActivity: 3,
    intenseActivity: 5.5
}

const getStepsString = async (activityToday: ActivityData) => {
    const stepsGoal = (await getGoal(GoalType.STEPS)).Value
    const stepsToday = activityToday.steps;
    const stepsFeedback = stepsToday < stepsGoal ?
        `${stepsGoal - stepsToday} below goal` :
        `${stepsToday - stepsGoal} above goal`
    const stepsScore = Math.floor((stepsToday / stepsGoal) * 100)
    const stepsString = `
    Steps: ${getScoreEmoji(stepsScore)}: ${stepsFeedback} - ${stepsScore}%`
    return stepsString
}

const calcActivity = (activityData: ActivityData) => {
    const METDone = Math.floor(
        ((activityData.softActivity / 60) * intensityMETWeights.softActivity) +
        ((activityData.moderateActivity / 60) * intensityMETWeights.moderateActivity) +
        ((activityData.intenseActivity / 60) * intensityMETWeights.intenseActivity)
    )
    return METDone
}

const getActivityVolumeString = async (curDate: string) => {
    const startDate = getMonday(new Date(curDate))
    const activitySinceMonday = (await queryHealthData(toShortISODate(startDate), curDate, HealthDataType.Activity, Provider.Unified)) as ActivityData[]
    const weeklyActivityGoal = (await getGoal(GoalType.WEEKLY_ACTIVITY)).Value
    const activityDonePastWeek = activitySinceMonday.map((curElement) => {
        return calcActivity(curElement)
    })
    const activityUntilToday = activityDonePastWeek.reduce((accum, curElem, idx) => {
        if (idx === activityDonePastWeek.length - 1) {
            return accum
        }
        return accum + curElem
    })

    console.log(activityDonePastWeek)

    const METToday = activityDonePastWeek[activityDonePastWeek.length - 1]

    const METRemaining = weeklyActivityGoal - activityUntilToday - METToday
    if (METRemaining > 0) {
        const remainingBeforeToday = weeklyActivityGoal - activityUntilToday
        const expectedRateBefore = Math.floor(remainingBeforeToday / (7 - activityDonePastWeek.length + 1))

        const remainingDays = 7 - activityDonePastWeek.length
        const averageInFuture = Math.floor(METRemaining / remainingDays)
        const percentage = Math.floor((METToday / expectedRateBefore) * 100)

        const todayFeedback = `${METToday} MET mins / ${expectedRateBefore} - ${percentage}% - ${getScoreEmoji(percentage)}`
        const activityString = `${todayFeedback}
Remaining activity for this week:  ${METRemaining} MET mins
You should aim to do ${averageInFuture} MET mins per day to achieve the goal
    `

        return activityString
    }
    else {
        const todayFeedback = `${METToday} MET mins - ${getScoreEmoji(100)}`
        const activityString = `${todayFeedback}
+${activityUntilToday + METToday - weeklyActivityGoal} MET mins Over the goal`

        return activityString
    }

}

const generateRefreshReminder = async () => {
    const curDate = new Date().toISOString().slice(0, 10);
    const activityToday = (await selectHealthData(curDate, HealthDataType.Activity, Provider.Unified, true)) as ActivityData;
    const sleepToday = (await selectHealthData(curDate, HealthDataType.Sleep, Provider.Unified, true)) as SleepData;
    return `Is this up-to-date? IF not resync the apps
Light Activity minutes: ${Math.floor(activityToday?.softActivity / 60)}
Moderate Activity minutes: ${Math.floor(activityToday?.moderateActivity / 60)}
Intense Activity minutes: ${Math.floor(activityToday?.intenseActivity / 60)}
Sleep Duration: ${sleepToday?.totalSleepDuration}`
}

const getActivityBody = async () => {

    // Fetch actual
    const curDate = new Date().toISOString().slice(0, 10);
    const activityToday = (await selectHealthData(curDate, HealthDataType.Activity, Provider.Unified, true)) as ActivityData;
    if (!activityToday) {
        return ""
    }

    const reportBody = `🏃 Activity:
${await getActivityVolumeString(curDate)}
    `
    return reportBody
}

const getSleepVolume = async (curDate: string) => {
    const sleepToday = (await selectHealthData(curDate, HealthDataType.Sleep, Provider.Unified, true)) as SleepData;
    const hoursSlept = Math.floor(sleepToday.totalSleepDuration / 60)
    const minutesSlept = sleepToday.totalSleepDuration - (hoursSlept * 60)
    return `${hoursSlept}H ${minutesSlept}M
Score: ${sleepToday.sleepScore}`
}

const getSleepBody = async () => {
        // Fetch actual
        const curDate = new Date().toISOString().slice(0, 10);
        const sleepToday = (await selectHealthData(curDate, HealthDataType.Sleep, Provider.Unified, true)) as SleepData;
        if (!sleepToday) {
            return ""
        }
    
        const reportBody = `😴 Sleep:
    ${await getSleepVolume(curDate)}
        `
        return reportBody
}
export const generateDailyReport = async () => {
    const activityPortion = await getActivityBody()
    const sleepPortion = await getSleepBody()
    const reportBody = `
    ${activityPortion}
    ${sleepPortion}
    `
    return {
        title: "Daily Health Report",
        body: reportBody
    }
}
