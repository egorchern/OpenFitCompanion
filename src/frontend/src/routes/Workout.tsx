import { useLoaderData } from "react-router-dom"
import { GetDayWorkout } from "../hooks/AI"
import { ActivityData, ActivityItem, GoalType, HealthDataType } from "../components/types"
import ExerciseItem from "./Workout/Exercise"
import { getActivityBody, getDateDiffInDays, getMonday, toShortISODate } from "../components/utilities"
import { useMemo } from "react"
import { GetGoal } from "../hooks/getGoal"
import { QueryHealthData } from "../hooks/queryHealthData"

export default function Workout() {
    const {date, timeOfDay} = useLoaderData() as any
    const temp = GetDayWorkout(new Date(date), timeOfDay)
    const data = temp.data as ActivityItem[]
    const weeklyActivityGoal = GetGoal(GoalType.WEEKLY_ACTIVITY)?.data?.Value
    const monday = getMonday(new Date(date))
    const activitySinceMonday = (QueryHealthData(toShortISODate(monday), date, HealthDataType.Activity)).data as any[]

    const activityString = useMemo(() => {
        
        if (!activitySinceMonday || !weeklyActivityGoal) {
            return ""
        }
        

        return getActivityBody(date, activitySinceMonday[activitySinceMonday.length - 1].data, weeklyActivityGoal)
    }, [date, activitySinceMonday, weeklyActivityGoal])
    return (
        <div className="flex-vertical small-gap">
            
            <h1>Exercise Plan for: {timeOfDay}</h1>
            <h2>Activity recorded today:</h2>
            <pre>

                {activityString}
            </pre>
            {
                data ? (
                    data.map((exercise) => {
                        return (
                            <ExerciseItem
                            key={JSON.stringify(exercise)}
                            {...exercise}
                            />
                        )
                    })
                ) : null
            }
        </div>
    )
}