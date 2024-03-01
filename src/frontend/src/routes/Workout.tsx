import { useLoaderData } from "react-router-dom"
import { GetDayWorkout } from "../hooks/AI"
import { ActivityItem } from "../components/types"
import ExerciseItem from "./Workout/Exercise"

export default function Workout() {
    const {date, timeOfDay} = useLoaderData() as any
    const temp = GetDayWorkout(new Date(date), timeOfDay)
    const data = temp.data as ActivityItem[]
    console.log(data)
    return (
        <div className="flex-vertical small-gap">
            <h1>Exercise Plan for: {timeOfDay}</h1>
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