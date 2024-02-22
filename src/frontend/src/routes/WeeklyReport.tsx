import {useLoaderData } from "react-router-dom";
import {getDateOffset, getMonday, toShortISODate} from "../components/utilities";
import AggregateActivity from "./WeeklyReport/AggregateActivity";


export default function WeeklyReport(){
    const curDate = new Date(useLoaderData() as any);
    const startDate = getDateOffset(curDate, -6)
    
    return (
        <main className="flex-vertical">
            <h1>Weekly Report</h1>
            <p>{toShortISODate(curDate)}</p>
            <h2>Activity:</h2>
            <AggregateActivity
            startDate={startDate}
            endDate={curDate}
            />
        </main>
    )
}