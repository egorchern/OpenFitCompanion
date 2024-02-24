import { useLoaderData } from "react-router-dom";
import { getDateOffset, getMonday, toShortISODate } from "../components/utilities";
import AggregateActivity from "./WeeklyReport/AggregateActivity";
import AggregateSleep from "./WeeklyReport/AggregateSleep";


export default function WeeklyReport() {
    const curDate = new Date(useLoaderData() as any);
    const startDate = getDateOffset(curDate, -6)

    return (
        <main className="flex-vertical">
            <h1>Weekly Report</h1>
            <p>{toShortISODate(startDate)} - {toShortISODate(curDate)}</p>
            <AggregateActivity
                startDate={startDate}
                endDate={curDate}
            />
            <AggregateSleep
                startDate={startDate}
                endDate={curDate}
            />
        </main>
    )
}