import Markdown from "react-markdown"
import { GetDayFeedback } from "../../hooks/AI"
export interface AIFeedbackProps{
    date: Date
}
export default function AIFeedback(props: AIFeedbackProps) {
    const {date} = props
    const {data} = GetDayFeedback(date)
    console.log(data)
    return (
        <div className="flex-vertical">
            <h2>AI Feedback</h2>
            {
                data ? (
                    <Markdown>
                        {data?.feedback}
                    </Markdown>
                ): null
            }
        </div>
    )
}