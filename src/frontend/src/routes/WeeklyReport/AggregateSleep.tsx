import { useMemo } from "react"
import { ActivityData, HealthDataType, SleepData } from "../../components/types"
import { calcActivity, getDateDiffInDays, toShortISODate } from "../../components/utilities"
import { QueryHealthData } from "../../hooks/queryHealthData"
import DataGraph from "../../components/dataGraph"
let { jStat } = require("jstat")
interface AggregateActivityProps {
    startDate: Date,
    endDate: Date
}
export default function AggregateSleep(props: AggregateActivityProps) {
    const { startDate, endDate } = props
    const { data } = QueryHealthData(toShortISODate(startDate), toShortISODate(endDate), HealthDataType.Sleep)
    const unifiedData = data ? data[2]?.data : null
    const sleepScores = useMemo(() => {
        if (!unifiedData){
            return []
        }
        return unifiedData.map((element: SleepData) => {
            return element.sleepScore
        })
    }, [unifiedData])
    const stats = useMemo(() => {
        if (!sleepScores) {
            return null
        }

        return {
            stdev: Math.round(jStat.stdev(sleepScores)),
            mean: Math.round(jStat.mean(sleepScores))
        }
    }, [sleepScores])

    const graphData = useMemo(() => {
        if (!unifiedData) {
            return undefined
        }
        return [
            {
                data: unifiedData.map((element: ActivityData) => {
                    return {
                        sleepScore: stats?.mean,
                        Date: element.date
                    }
                }),
                provider: "Mean"
            },
            {
                data: sleepScores.map((element: number, index: number) => {
                    return {
                        sleepScore: element,
                        Date: unifiedData[index].date
                    }

                }),
                provider: "Current"
            }

        ]
    }, [unifiedData, sleepScores, stats])
    console.log(graphData)
    return (
        <div className="flex-vertical full-width small-gap">
            <h2>Sleep:</h2>
            <DataGraph
                type={HealthDataType.Sleep}
                startDate={startDate}
                data={graphData}
                interval={getDateDiffInDays(startDate, endDate)}
                propertyName={"sleepScore"} />
            <div>
                <p>Average: {stats?.mean}</p>
                <p>Consistency (lower is better): {stats?.stdev}</p>
            </div>


        </div>
    )
}