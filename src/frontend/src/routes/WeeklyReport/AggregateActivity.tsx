import { toShortISODate } from "../../components/utilities"

interface AggregateActivityProps {
    startDate: Date,
    endDate: Date
}
export default function AggregateActivity(props: AggregateActivityProps){
    const {startDate, endDate} = props
    return (
        <div>
            {toShortISODate(startDate)} - {toShortISODate(endDate)}
        </div>
    )
}