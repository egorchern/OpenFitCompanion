import { getGoal } from "./db/goals/select.mjs";
import { GoalType } from "./db/goals/types.mjs";
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
    for(let i = 0; i < thresholds.length; i++){
        const threshold = Number(thresholds[i])
        if (score <= threshold){
            return scorePointsToEmoji[threshold]
        }
    }
    return scorePointsToEmoji[thresholds[thresholds.length - 1]]

}
export const generateDailyReport = async () => {
    // Fetch goals
    const activityGoals = (await getGoal(HealthDataType.Activity)) as ActivityData
    const stepsGoal = activityGoals.steps
    // Fetch actual
    const curDate = new Date().toISOString().slice(0, 10);
    const activityToday = (await selectHealthData(curDate, HealthDataType.Activity, Provider.Unified, true)) as ActivityData;
    if (!activityToday){
        throw new Error("No activity data for today!")
    }
    const stepsToday = activityToday.steps;
    const stepsFeedback = stepsToday < stepsGoal ? 
    `${stepsGoal - stepsToday} below goal` : 
    `${stepsToday - stepsGoal} above goal`
    const score = Math.floor((stepsToday / stepsGoal) * 100)
    const reportBody = `
    Steps ${getScoreEmoji(score)}: ${stepsFeedback} - ${score}%
    `
    return {
        title: "Daily Health Report",
        body: reportBody
    }
}