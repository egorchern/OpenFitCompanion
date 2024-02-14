import { Button, FormControl, FormHelperText, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";
import SendIcon from '@mui/icons-material/Send';
import { toShortISODate } from "../../components/utilities";
import { ExecutePrompt } from "../../hooks/AI";
const curDate = new Date()
const preparedPrompts = {
    "ActivityPlan": `using this week's activity data, create physical activity plan for ${toShortISODate(curDate)}
    just provide activities and their description. Make sure the plan provides balanced activity for the week.
    make sure that the plan provides enough activity to hit my MET weekly target as per profile. Make sure to include strength-training exercises that utilize weights on gym going days`,
    "MealPlan": `create a meal plan for today`,
    "FeedbackOverall": `Using this month's health data, provide a feedback on my health. Make sure to provide what areas I have done well in, and areas that I need to improve on. today's date: ${toShortISODate(curDate)}. `
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