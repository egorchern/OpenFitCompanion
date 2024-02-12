import { Form, useLoaderData } from "react-router-dom";
import { getDateDiffInDays, getMonday, toShortISODate } from "../../components/utilities";
import { QueryHealthData } from "../../hooks/queryHealthData";
import { ActivityData, GoalType, HealthDataType, Provider } from "../../components/types";
import { GetGoal } from "../../hooks/getGoal";
import { useEffect, useMemo } from "react";
import DataGraph from "../../components/dataGraph";
import { act } from "react-dom/test-utils";

const intensityMETWeights = {
    softActivity: 1.75,
    moderateActivity: 3,
    intenseActivity: 5.5
}

const calcActivity = (activityData: ActivityData) => {
    const METDone = Math.floor(
        ((activityData.softActivity / 60) * intensityMETWeights.softActivity) +
        ((activityData.moderateActivity / 60) * intensityMETWeights.moderateActivity) +
        ((activityData.intenseActivity / 60) * intensityMETWeights.intenseActivity)
    )
    return METDone
}

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


const getActivityVolumeString = (curDate: string, activitySinceMonday: ActivityData[], weeklyActivityGoal: number) => {

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

        const todayFeedback = `${METToday}/${expectedRateBefore} MET Minutes - ${percentage}% - ${getScoreEmoji(percentage)}`
        let activityString = `${todayFeedback}
Remaining activity for this week:  ${METRemaining} MET mins
You should aim to do ${averageInFuture} MET mins per day to achieve the goal`

        return activityString
    }
    else {
        const todayFeedback = `${METToday} MET mins - ${getScoreEmoji(100)}`
        let activityString = `${todayFeedback}
+${activityUntilToday + METToday - weeklyActivityGoal} MET mins Over the goal`
        return activityString
    }

}

const getActivityBody = (curDate: string, activitySinceMonday: ActivityData[], weeklyActivityGoal: number) => {

    // Fetch actual


    const startDate = getMonday(new Date(curDate))

    const activityToday = activitySinceMonday[activitySinceMonday.length - 1]

    const reportBody = `🏃 Activity: ${getActivityVolumeString(curDate, activitySinceMonday, weeklyActivityGoal)}
    `
    return reportBody
}
interface DailyActivityProps {
    curDate: Date,
    startDate: Date
}

function DailyActivity(props: DailyActivityProps) {
    const { curDate, startDate } = props
    let activitySinceMonday = (QueryHealthData(toShortISODate(startDate), toShortISODate(curDate), HealthDataType.Activity)).data as any[]

    const weeklyActivityGoal = GetGoal(GoalType.WEEKLY_ACTIVITY)?.data?.Value
    const activityString = useMemo(() => {
        if (!activitySinceMonday || !weeklyActivityGoal) {
            return ""
        }
        return getActivityBody(toShortISODate(curDate), activitySinceMonday[activitySinceMonday.length - 1].data, weeklyActivityGoal)
    }, [curDate, activitySinceMonday, weeklyActivityGoal])
    const METActivitySinceMonday = useMemo(() => {
        if (!activitySinceMonday) {
            return undefined
        }
        const unifiedData = activitySinceMonday[activitySinceMonday.length - 1].data
        const METUpToArr: number[] = []
        let accum = 0;
        for (const cur of unifiedData) {
            accum += calcActivity(cur)
            METUpToArr.push(accum)
        }
        return [{
            data: unifiedData.map((element: ActivityData, index: number) => {
                return {
                    METMinutes: METUpToArr[index],
                    Date: element.date
                }
            }),
            provider: "Current"
        }, {
            data: unifiedData.map((element: ActivityData) => {
                return {
                    METMinutes: weeklyActivityGoal,
                    Date: element.date
                }
            }),
            provider: "Goal"
        }]
    }, [activitySinceMonday, weeklyActivityGoal])
    console.log(METActivitySinceMonday)
    return (

        <>
            <DataGraph
                type={HealthDataType.Activity}
                startDate={startDate}
                data={METActivitySinceMonday}
                interval={getDateDiffInDays(startDate, new Date(curDate))}
                propertyName={"METMinutes"} /><pre>{activityString}</pre>
        </>

    )
}
export default DailyActivity;