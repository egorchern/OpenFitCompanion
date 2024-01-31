import { getGoal } from "./db/goals/select.mjs";
import { Goal, GoalType } from "./db/goals/types.mjs";
import { selectHealthData } from "./db/healtData/select.mjs";
import { HealthDataType } from "./db/healtData/types.mjs";
import { ActivityData, Provider } from "./types.mjs";
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
    softActivity: 2.25,
    moderateActivity: 4.5,
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

const getActivityString = async (activityToday: ActivityData) => {
    const weeklyActivityGoal = (await getGoal(GoalType.WEEKLY_ACTIVITY)).Value
    const ReferenceMETPerDay = Math.floor(weeklyActivityGoal / 7)
    const activityMETMinutes =
        ((activityToday.softActivity / 60)  * intensityMETWeights.softActivity) +
        ((activityToday.moderateActivity / 60) * intensityMETWeights.moderateActivity) +
        ((activityToday.intenseActivity / 60) * intensityMETWeights.intenseActivity)
    const activityString = `
    Activity: ${activityMETMinutes} / ${ReferenceMETPerDay}`
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
   
    const reportBody = `
    ${await getStepsString(activityToday)}
    ${await getActivityString(activityToday)}
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
