import { GoalType } from "../common/db/goals/types.mjs"
import { getGoal } from "../common/db/goals/select.mjs"
import config from "./config.json" assert { type: "json" }
import { selectHealthData } from "../common/db/healtData/select.mjs";
import { HealthDataType } from "../common/db/healtData/types.mjs";
export const handler = async (event: any) => {
    // Fetch goals
    const stepsGoal = (await getGoal(GoalType.STEPS)).Value;
    // Fetch actual
    const curDate = new Date().toISOString().slice(0, 10);
    const activityToday = await selectHealthData(curDate, HealthDataType.Activity) as any;
    if (!activityToday){
        throw new Error("No activity data for today!")
    }
    const stepsToday = activityToday.Steps;
    const score = Math.floor((stepsToday / stepsGoal) * 100)
    console.log(score);

}

handler("")