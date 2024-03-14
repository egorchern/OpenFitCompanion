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
    const prompt = `
    Common instructions: use this week's activity data. Don't summarise prior information just give the answer. Format your entire response in JSON in the following format: 
    [{"exerciseTitle": string, "exerciseStartAtTime": string, "exerciseDuration": number, "exerciseCategory": string, "exerciseIntensityCategory": string, "exerciseNotes": string}] 
    exerciseStartAtTime can only have the following values: "morning", "midday", "late_afternoon" and "early_evening". 
    exerciseCategory should indicate the type of exercise such as cardio, strength building etc
    exerciseIntensityCategory can only have the following values: "softActivity", "moderateActivity" and "intenseActivity". 
    In exerciseNotes include detailed description of how to perform the exercise, as well as that exercise's benefits. 
    Don't create groups of exercises as a single item, instead write them all as a separate exercise.
    Please include some activities for all values of exerciseStartAtTime, however the majority of activities should be scheduled in late afternoon. Make sure to use userData.json file to tailor your response. First, calculate if the day is a gym-going day (if it is in profile's gym-going days), then create the activity plan accordingly. 
    Include intense strength training exercises that use equipment on gym going days at late afternoon. Otherwise, create a mix of exercises that don't need equipment and exercises that use equipment that the user has at home. Prioritize variety of activities. Make sure total MET minutes for the day are not too high considering the weekly MET target. 
    Use the following minutes to MET minutes conversion map: """ "intensityMETWeights" = ${JSON.stringify(intensityMETWeights)} """

    Q: Create activity plan for: 2024-02-22 which is Thursday. User's profile: """{"currentFitnessLevel": "Intermediate", "excludeActivitiesKeywords": "yoga, run, jog, bike, swim", "gymDays": ["Wednesday", "Saturday"], homeEquipment: "resistance bands"}""". User's activity data for this week shows lack of steps and soft activity.
    A: Since Thursday is not in user's gym days, I won't recommend intense strength building activities and I won't recommend activities that uses equipment which is not in this list: resistance bands. Result: \`\`\`
    [
        {
            "exerciseTitle": "Morning Stretch Routine",
            "exerciseStartAtTime": "morning",
            "exerciseDuration": 15,
            "exerciseCategory": "flexibility",
            "exerciseIntensityCategory": "softActivity",
            "exerciseNotes": "Start your day with a 15-minute stretching session to wake up your body. Focus on gentle stretches for all major muscle groups to improve flexibility and reduce the risk of injury."
        },
        {
            "exerciseTitle": "Midday Walk",
            "exerciseStartAtTime": "midday",
            "exerciseDuration": 30,
            "exerciseCategory": "cardio",
            "exerciseIntensityCategory": "softActivity",
            "exerciseNotes": "Take a brisk 30-minute walk during your lunch break. This will help you meet your daily steps goal and boost your cardiovascular health."
        },
        {
            "exerciseTitle": "Bodyweight Workout Circuit: abs, legs, chest and arms",
            "exerciseStartAtTime": "late_afternoon",
            "exerciseDuration": 30,
            "exerciseCategory": "strength_building, endurance",
            "exerciseIntensityCategory": "moderateActivity",
            "exerciseNotes": "For 30 minutes, alternate between following exercises, taking rests as needed, doing as many reps as you can achieve: sit-up, squat, push-up. Improves muscle strength and endurance"
        },
        {
            "exerciseTitle": "Joint health circuit: knees, wrists",
            "exerciseStartAtTime": "early_evening",
            "exerciseDuration": 15,
            "exerciseCategory": "flexibility",
            "exerciseIntensityCategory": "softActivity",
            "exerciseNotes": "For 30 minutes, alternate between following exercises, taking rests as needed, doing as many reps as you can achieve: Hamstring bridge, backwards walk, wrist rotation. Improves Joint strength, reducing chance of injury and pain"
        }
    ]
    \`\`\`
    Q: Create activity plan for: ${toShortISODate(date)} which is ${getDayOfWeek(date)}. 
    
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
    const prompt = `
    Common instructions: Compare with past days of this week. Highlight 2 things I have done well and 2  things that need improvement. 
    Be specific and mention specific measurements. Refer to my activity and sleep data. Don't mention anything about excluded activities. Use recommendations from health organisations such as WHO as reference.
    Q: Provide feedback for a single day: 2024-02-22 which is Thursday. User's activity data: """{"intenseActivity":120,"caloriesBurned":634,"Type":"activity_Unified","Provider":"Unified","date":"2024-02-22","steps":8058,"provider":"Unified","moderateActivity":6037,"softActivity":4710,"type":"activity"}""", user's sleep data: """{"bedtimeStart":1710395431,"totalSleepDuration":387,"averageHR":61, "bedtimeEnd":1710418621,"Type":"sleep_Unified","Provider":"Unified","sleepScore":66,"date":"2024-02-22","lightSleepDuration":10890,"sleepLatency":645,"sleepEfficiency":94,"provider":"Unified","deepSleepDuration":9540,"remSleepDuration":2550,"type":"sleep"}""". User's sleep data for this week indicates inconsistent bedtime routine, but good amount of deep sleep overall. User's activity data indicates good consistency of exercise but overall lack of intense activity.
    A: Comparing 2024-02-22 with other days of the week. First working out positives: user has good deep sleep percentage which is consistent and the user exercised a good, consistent amount today. Secondly, working out negatives: user slept less than WHO recommended 7 hours, and user didn't do enough intense activity. Result:
    Areas of achievement: 
    1) Good percentage of deep sleep: deep sleep is the most restorative sleep phase, indicating good mental condition. You had 159 mins of deep sleep, this is 25 minutes more than yesterday, showing improvement. Your deep sleep is fairly consistent which is also a positive
    2) Excellent exercise consistency: You have burned 634 calories through activities today, this is an excellent number and is decently consistent with this week's data. Physical activity promotes better mental state as well as increase your athleticism
    Areas of Improvement: 
    1) Poor sleep duration: You only slept around 6 hours, whereas WHO recommends a minimum of 7 hours for adults. Strive to adjust your bedtime schedule to get at least 7 hours or more
    2) Poor intense activity amount: you only did 2 mins of intense activity today. Looking at this week's data, you have low average intense activity minutes per day. Intense activity is beneficial in raising your athleticism as well as reducing risks of cardiovascular diseases. 
    Q: Provide feedback for a single day: ${toShortISODate(date)} which is ${getDayOfWeek(date)}.`
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
