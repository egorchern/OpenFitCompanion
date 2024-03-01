import OpenAI from "openai";
import { selectAIFeedback, selectAIWorkout, selectUserData } from "./db/userData/select.mjs";
import { UserDataType } from "./db/userData/types.mjs";
import { getDateOffset, getDayOfWeek, getMonday, getRandomInt, intensityMETWeights, sleep, toShortISODate } from "./utilities.mjs";
import { queryHealthData } from "./db/healtData/query.mjs";
import { HealthDataType } from "./db/healtData/types.mjs";
import { ActivityItem, Provider, timesOfDay } from "./types.mjs";
import { selectHealthData } from "./db/healtData/select.mjs";
import { writeFileSync, createReadStream } from "fs";
import { insertAIFeedback, insertAIWorkout, insertUserData } from "./db/userData/insert.mjs";
import { MessageContentText } from "openai/resources/beta/threads/index.mjs";
import { getExerciseVideoUrl } from "./api_requests/youtube/getVideo.mjs";
const openai = new OpenAI()
const assistantID = "asst_25NkwbnXpgZ7u71Efatue99o"

// SYSTEM PROMPT: You are a fitness coach. Data will be delimited by triple quotes
// Data will be in JSON format
// Use user's profile information and health data to tailor your response.
// intenseActivity, moderateActivity and softActivity are in meassured in seconds

// Before: user's profile: """""". no need to respond to this request. 

// USER PROMPT: using this week's activity data, create physical activity plan for {todaysDate}
// activity data: """{data}""
// for this response, try to introduce variety when compared to your previous responses.

// const message = await openai.beta.threads.messages.create(
//   threadID,
//   {
//     role: "user"
//   }
// )
export const getThreadMessages = async () => {
    const gptData = await selectUserData(UserDataType.GPT)
    const threadID = gptData?.threadID
    const userDataFileID = gptData?.fileID
    const messages = await openai.beta.threads.messages.list(
        threadID, {
            limit: 10
        }
      );
    return messages
}
// export const sendProfile = async () => {
//     const profile = await selectUserData(UserDataType.Profile)
//     console.log(profile)
//     const prompt = `Updated user's profile: """${JSON.stringify(profile)}"""`
//     const message = await openai.beta.threads.messages.create(
//         threadID,
//         {
//             role: "user",
//             content: prompt
//         }
//     );
// }


export const executePrompt = async (prompt: string, waitForCompletion = false) => {
    await createNewThread()
    const gptData = await selectUserData(UserDataType.GPT)
    const threadID = gptData?.threadID
    const userDataFileID = gptData?.fileID
    const message = await openai.beta.threads.messages.create(
        threadID,
        {
            role: "user",
            content: prompt,
            file_ids: [userDataFileID]
        }
    );
    let run = await openai.beta.threads.runs.create(
        threadID,
        {
            assistant_id: assistantID
        }
    );
    const waitStatuses = ["queued", "in_progress"]
    // poll the run for completion
    if (!waitForCompletion){
        return run
    }
    console.log(run)
    while (waitStatuses.includes(run.status)){
        await sleep(10000)
        run = await openai.beta.threads.runs.retrieve(
            threadID,
            run.id
          );
          console.log(run)
    }
    
    
}

const processFeedback = async (text: string) => {
    const regexp = /`\`\`json(.*)\`\`\`/gs
    const feedback = JSON.parse(Array.from(text.matchAll(regexp), m => m[1])[0]) as ActivityItem[]
    console.log(feedback)
    await Promise.allSettled(feedback.map(async (activityItem, index) => {
        const METMinutes = intensityMETWeights[activityItem.exerciseIntensityCategory] * activityItem.exerciseDuration
        activityItem.exerciseMETMinutes = METMinutes
        const youtubeUrl = await getExerciseVideoUrl(activityItem.exerciseTitle)
        console.log(youtubeUrl)
        activityItem.youtubeUrl = youtubeUrl
    }))

    const res: any = {}
    timesOfDay.map((time) => {
        res[time] = []
    })
    feedback.map((activityItem) => {
        res[activityItem.exerciseStartAtTime].push(activityItem)
    })
    
    return JSON.stringify(res)
}

export const getDaysWorkoutPlan = async (date: Date) => {
    const dbData = await selectAIWorkout(date)
    if (dbData){
        return dbData.feedback
    }
    const prompt = `Create activity plan for: ${toShortISODate(date)} which is ${getDayOfWeek(date)}. Only use this week's activity data. Don't summarise prior information just give the answer. Format your entire response in JSON in the following format: 
    [{"exerciseTitle": string, "exerciseStartAtTime": string, "exerciseDuration": number, "exerciseCategory": string, "exerciseIntensityCategory": string, "exerciseNotes": string}] 
    exerciseStartAtTime can only have the following values: "morning", "midday", "late_afternoon" and "early_evening". 
    exerciseCategory should indicate the type of exercise such as cardio, strength building etc
    exerciseIntensityCategory can only have the following values: "softActivity", "moderateActivity" and "intenseActivity". 
    In exerciseNotes include detailed description of how to perform the exercise, as well as that exercise's benefits. 
    Don't create groups of exercises as a single item, instead write them all as a separate exercise.
    Please include some activities for all values of exerciseStartAtTime, however the majority of activities should be scheduled in late afternoon. Make sure to use userData.json file to tailor your response. First, work out the day of the week, then calculate if the day is a gym-going day (if it is in profile's gym-going days), then create the activity plan accordingly. 
    Include intense strength training exercises that use equipment on gym going days at late afternoon. Otherwise, don't include exercises that need equipment. Prioritize variety of activities. Make sure total MET minutes for the day are not too high considering the weekly MET target. 
    Use the following minutes to MET minutes conversion map: """ "intensityMETWeights" = ${JSON.stringify(intensityMETWeights)} """
    `
    const run = await executePrompt(prompt, true)
    await sleep(10000)
    const messages = await getThreadMessages()
    const text = (messages.data[0].content[0] as MessageContentText).text.value
    console.log(text)
    const feedback = await processFeedback(text)
    
    await insertAIWorkout({
        date: toShortISODate(date),
        feedback: feedback
    })
    return feedback
    
}

export const getDaysFeedback = async (date: Date) => {
    const dbData = await selectAIFeedback(date)
    if (dbData){
        return dbData.feedback
    }
    const prompt = `Provide feedback for a single day: ${toShortISODate(date)}. First workout the day of the week for that day. Compare with past days of this week. Highlight 2 things I have done well and 2  things that need improvement. 
    Be specific and mention specific meassurements. Refer to my activity and sleep data. Don't mention anything about excluded activities. Use recommendations from health organisations such as WHO as reference.`
    const run = await executePrompt(prompt, true)
    await sleep(10000)
    const messages = await getThreadMessages()
    const feedback = (messages.data[0].content[0] as MessageContentText).text.value
    await insertAIFeedback({
        date: toShortISODate(date),
        feedback: feedback
    })
    return feedback
}

export const saveMonthsData = async () => {
    // get data
    const gptData = await selectUserData(UserDataType.GPT)
    const threadID = gptData?.threadID
    const userDataFileID = gptData?.fileID
    const endDate = new Date()
    const startDate = getDateOffset(endDate, -30)
    const activityData = await queryHealthData(toShortISODate(startDate), toShortISODate(endDate), HealthDataType.Activity, Provider.Unified)
    const sleepData = await queryHealthData(toShortISODate(startDate), toShortISODate(endDate), HealthDataType.Sleep, Provider.Unified)
    const profile = await selectUserData(UserDataType.Profile)
    const data = JSON.stringify({
        activity: activityData,
        sleep: sleepData,
        profile: profile
    }, null, 2)
    const filename = "userData.json"
    writeFileSync(filename, data);
    await openai.files.del(userDataFileID).catch((re) => console.log(re))
    const file = await openai.files.create({
        file: createReadStream(filename),
        purpose: "assistants"
    })
    
    await insertUserData({
        fileID: file.id,
        threadID: threadID
    }, UserDataType.GPT)
}

export const createNewThread = async () => {
    const gptData = await selectUserData(UserDataType.GPT)
    const threadID = gptData?.threadID
    const userDataFileID = gptData?.fileID
    const newThread = await openai.beta.threads.create()
    await insertUserData({
        fileID: userDataFileID,
        threadID: newThread.id
    }, UserDataType.GPT)
}

await getDaysWorkoutPlan(new Date("2024-03-01"))