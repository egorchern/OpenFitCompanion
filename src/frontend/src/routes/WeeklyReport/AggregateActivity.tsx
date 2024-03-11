import { useMemo } from "react"
import { ActivityData, HealthDataType } from "../../components/types"
import { calcActivity, getDateDiffInDays, toShortISODate } from "../../components/utilities"
import { QueryHealthData } from "../../hooks/queryHealthData"
import DataGraph from "../../components/dataGraph"
let { jStat } = require("jstat")
interface AggregateActivityProps {
    startDate: Date,
    endDate: Date
}
export default function AggregateActivity(props: AggregateActivityProps) {
    const { startDate, endDate } = props
    const { data } = QueryHealthData(toShortISODate(startDate), toShortISODate(endDate), HealthDataType.Activity)
    const unifiedData = data ? data[2]?.data : null
    const mets = useMemo(() => {
        if (!unifiedData) {
            return null
        }
        return unifiedData.map((element: ActivityData) => {
            return calcActivity(element)
        })
    }, [unifiedData])

    const stats = useMemo(() => {
        if (!mets) {
            return null
        }

        return {
            stdev: Math.round(jStat.stdev(mets)),
            mean: Math.round(jStat.mean(mets))
        }
    }, [mets])

    const graphData = useMemo(() => {
        if (!unifiedData) {
            return undefined
        }
        return [
            {
                data: unifiedData.map((element: ActivityData) => {
                    return {
                        METMinutes: stats?.mean,
                        Date: element.date
                    }
                }),
                provider: "Mean"
            },
            {
                data: mets.map((element: number, index: number) => {
                    return {
                        METMinutes: element,
                        Date: unifiedData[index].date
                    }

                }),
                provider: "Current"
            }

        ]
    }, [unifiedData, mets, stats])
    return (
        <div className="flex-vertical full-width small-gap">
            <h2>Activity:</h2>
            <DataGraph
                type={HealthDataType.Activity}
                startDate={startDate}
                data={graphData}
                interval={getDateDiffInDays(startDate, endDate)}
                propertyName={"METMinutes"} />
            <div>
                <p>Average: {stats?.mean}</p>
                <p>Consistency (lower is better): {stats?.stdev}</p>
            </div>


        </div>
    )
}