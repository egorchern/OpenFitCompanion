import {useLoaderData } from "react-router-dom";
import {getMonday, toShortISODate} from "../components/utilities";

import DailyActivity from "./DailyReport/DailyActivity";

function DailyReport() {
    const curDate = new Date(useLoaderData() as any);
    const startDate = getMonday(new Date(curDate))
    
    return (
        <main className="flex-vertical">
            <h1>Daily Report</h1>
            <p>{toShortISODate(curDate)}</p>
            <h2>Activity:</h2>
            <DailyActivity
            curDate={curDate}
            startDate={startDate}
            />
        </main>
    )
}
export default DailyReport;