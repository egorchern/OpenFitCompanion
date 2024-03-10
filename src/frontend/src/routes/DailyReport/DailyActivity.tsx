import { Form, useLoaderData } from "react-router-dom";
import { calcActivity, getActivityBody, getDateDiffInDays, getMonday, toShortISODate } from "../../components/utilities";
import { QueryHealthData } from "../../hooks/queryHealthData";
import { ActivityData, GoalType, HealthDataType, Provider } from "../../components/types";
import { GetGoal } from "../../hooks/getGoal";
import { useEffect, useMemo } from "react";
import DataGraph from "../../components/dataGraph";
import { act } from "react-dom/test-utils";



interface DailyActivityProps {
    curDate: Date,
    startDate: Date
}

function DailyActivity(props: DailyActivityProps) {
    const { curDate, startDate } = props
    let activitySinceMonday = (QueryHealthData(toShortISODate(startDate), toShortISODate(curDate), HealthDataType.Activity)).data as any[]

    const weeklyActivityGoal = GetGoal(GoalType.WEEKLY_ACTIVITY)?.data
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