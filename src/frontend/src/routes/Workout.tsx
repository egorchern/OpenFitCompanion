import { useLoaderData } from "react-router-dom"
import { GetDayWorkout } from "../hooks/AI"

export default function Workout() {
    const {date, timeOfDay} = useLoaderData() as any
    const {data} = GetDayWorkout(new Date(date), timeOfDay)
    console.log(data)
    return (
        <div>

        </div>
    )
}