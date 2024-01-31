import { getGoal } from "./db/goals/select.mjs";
import { Goal, GoalType } from "./db/goals/types.mjs";
import { queryHealthData } from "./db/healtData/query.mjs";
import { selectHealthData } from "./db/healtData/select.mjs";
import { HealthDataType } from "./db/healtData/types.mjs";
import { ActivityData, Provider } from "./types.mjs";
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
    softActivity: 1.85,
    moderateActivity: 3.25,
    intenseActivity: 7
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

const getActivityString = async (curDate: string) => {
    const startDate = getMonday(new Date(curDate))
    const activitySinceMonday = (await queryHealthData(toShortISODate(startDate), curDate, HealthDataType.Activity, Provider.Unified)) as ActivityData[]
    const weeklyActivityGoal = (await getGoal(GoalType.WEEKLY_ACTIVITY)).Value
    const activityDonePastWeek = activitySinceMonday.map((curElement) => {
        const METDone = Math.floor(
            ((curElement.softActivity / 60)  * intensityMETWeights.softActivity) +
            ((curElement.moderateActivity / 60) * intensityMETWeights.moderateActivity) +
            ((curElement.intenseActivity / 60) * intensityMETWeights.intenseActivity)
        )
        return METDone
    })
    const activityUntilToday = activityDonePastWeek.reduce((accum, curElem, idx) => {
        if (idx === activityDonePastWeek.length - 1){
            return accum
        } 
        return accum + curElem
    })
    
    console.log(activityDonePastWeek)

    const METToday = activityDonePastWeek[activityDonePastWeek.length - 1]
    const remainingBeforeToday = weeklyActivityGoal - activityUntilToday
    console.log(remainingBeforeToday)
    const expectedRateBefore = Math.floor(remainingBeforeToday / (7 - activityDonePastWeek.length + 1))
    const METRemaining = weeklyActivityGoal - activityUntilToday - METToday
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
const generateRefreshReminder = async () => {

}
const getActivityBody = async () => {
   
    // Fetch actual
    const curDate = new Date().toISOString().slice(0, 10);
    const activityToday = (await selectHealthData(curDate, HealthDataType.Activity, Provider.Unified, true)) as ActivityData;
    if (!activityToday) {
        throw new Error("No activity data for today!")
    }
   
    const reportBody = `🏃 Activity:
${await getActivityString(curDate)}
    `
    return reportBody
}

export const generateDailyReport = async () => {
    const activityPortion = await getActivityBody()
    const reportBody = `
    ${activityPortion}
    `
    return {
        title: "Daily Health Report",
        body: reportBody
    }
}
