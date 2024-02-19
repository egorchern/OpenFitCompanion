import { Button, FormControl, FormHelperText, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";
import SendIcon from '@mui/icons-material/Send';
import { toShortISODate } from "../../components/utilities";
import { ExecutePrompt } from "../../hooks/AI";
const curDate = new Date()
const preparedPrompts = {
    "ActivityPlan": `using this week's activity data, create physical activity plan for a single day: ${toShortISODate(curDate)}. First calculate which day of the week the date is. just provide activities and their description. Make sure the plan provides balanced activity for the week.
    make sure that the plan provides enough activity to hit my MET weekly target as per profile. Indicate how many MET minutes every activity provides. Make sure to include strength-training exercises that utilize weights on gym going days. Consider my activity and sleep data this week.`,
    "MealPlan": `create a meal plan for today. Use latest healthy lifestyle recommendations from bodies such as NHS or WHO for reference`,
    "FeedbackOverall": `Using this month's health data: activity and sleep data, provide an overall feedback on my health. Make sure to provide what 3 areas I have done well in, and 3 areas that I need to improve on. Don't mention specific days, talk about the overall situation. Use latest healthy lifestyle recommendations from bodies such as NHS or WHO for reference. today's date: ${toShortISODate(curDate)}. `,
    "FeedbackDay": `provide feedback for a single day: ${toShortISODate(curDate)}. Highlight 2 things I have done well and 2 things that need improvement. Be specific and mention specific meassurements. Refer to my activity and sleep data.`
}
export default function Control() {
    const [prompt, setPrompt] = useState("")
    const handlePromptInput = (ev: any) => {
        setPrompt(ev.target.value)
    }
    const mutation = ExecutePrompt()
    const handleSubmit = (ev: any) => {
        ev.preventDefault()
        mutation.mutate(prompt as any)
    }
    return (
        <form className="flex-horizontal full-width chatWindow" onSubmit={handleSubmit}>
            <Button variant='contained' onClick={() => {setPrompt(preparedPrompts.ActivityPlan)}}>Activity plan for Today</Button>
            <Button variant='contained' onClick={() => {setPrompt(preparedPrompts.MealPlan)}}>Meal plan</Button>
            <Button variant='contained' onClick={() => {setPrompt(preparedPrompts.FeedbackOverall)}}>Feedback on overall health</Button>
            <Button variant='contained' onClick={() => {setPrompt(preparedPrompts.FeedbackDay)}}>Feedback on particular day</Button>
            <div className="full-width flex-horizontal position-relative">
                <TextField
                    InputProps={{
                        endAdornment: <InputAdornment position="end"><Button type='submit' variant="contained" endIcon={<SendIcon />}>
                            Send
                        </Button></InputAdornment>
                    }}
                    className="full-width" multiline value={prompt} onChange={handlePromptInput} type='number' label="Prompt" variant="outlined" />

            </div>
        </form>
    )
}