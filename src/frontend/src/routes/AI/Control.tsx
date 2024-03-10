import { Button, FormControl, FormHelperText, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";
import SendIcon from '@mui/icons-material/Send';
import { getDayOfWeek, intensityMETWeights, toShortISODate } from "../../components/utilities";
import { ExecutePrompt } from "../../hooks/AI";
const curDate = new Date()
const preparedPrompts = {
    "ActivityPlan": `Create activity plan for: ${toShortISODate(curDate)} which is ${getDayOfWeek(curDate)}. Only use this week's activity data. Don't summarise prior information just give the answer. Format your entire response in JSON in the following format: 
    [{"exerciseTitle": string, "exerciseStartAtTime": string, "exerciseDuration": number, "exerciseCategory": string, "exerciseIntensityCategory": string, "exerciseNotes": string}] 
    exerciseStartAtTime can only have the following values: "morning", "midday", "late_afternoon" and "early_evening". 
    exerciseCategory should indicate the type of exercise such as cardio, strength building etc
    exerciseIntensityCategory can only have the following values: "softActivity", "moderateActivity" and "intenseActivity". 
    In exerciseNotes include detailed description of how to perform the exercise, as well as that exercise's benefits. 
    Don't create groups of exercises as a single item, instead write them all as a separate exercise.
    Please include some activities for all values of exerciseStartAtTime, however the majority of activities should be scheduled in late afternoon. Make sure to use userData.json file to tailor your response. First, work out the day of the week, then calculate if the day is a gym-going day (if it is in profile's gym-going days), then create the activity plan accordingly. 
    Include intense strength training exercises that use equipment on gym going days at late afternoon. Otherwise, don't include exercises that need equipment. Prioritize variety of activities. Make sure total MET minutes for the day are not too high considering the weekly MET target. 
    Use the following minutes to MET minutes conversion map: """ "intensityMETWeights" = ${JSON.stringify(intensityMETWeights)} `,
    "MealPlan": `create a meal plan for today. Use latest healthy lifestyle recommendations from bodies such as NHS or WHO for reference`,
    "FeedbackOverall": `From userData.json using data from last 30 days, provide an overall feedback on my health. Today's date: ${toShortISODate(curDate)}. First, workout the date range that you need to use.  Don't mention anything about excluded activities. Don't mention excludeActivitiesKeywords. Make sure to provide what 3 areas I have done well in, and 3 areas that I need to improve on. Use latest healthy lifestyle recommendations from bodies such as NHS or WHO for reference. `,
    "FeedbackDay": `Use userData.json. Provide feedback for a single day: ${toShortISODate(curDate)}. First workout the day of the week for that day. Compare with past days of this week. Highlight 2 things I have done well and 2  things that need improvement. 
    Be specific and mention specific meassurements. Refer to my activity and sleep data. Use recommendations from health organisations such as WHO as reference.`
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
        <form className="flex-horizontal small-gap full-width chatWindow" onSubmit={handleSubmit}>
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