import OpenAI from "openai";
import { selectUserData } from "./db/userData/select.mjs";
import { UserDataType } from "./db/userData/types.mjs";
import { getDateOffset, getMonday, getRandomInt, sleep, toShortISODate } from "./utilities.mjs";
import { queryHealthData } from "./db/healtData/query.mjs";
import { HealthDataType } from "./db/healtData/types.mjs";
import { Provider } from "./types.mjs";
import { selectHealthData } from "./db/healtData/select.mjs";
import { writeFileSync, createReadStream } from "fs";
import { insertUserData } from "./db/userData/insert.mjs";
const openai = new OpenAI()
const assistantID = "asst_25NkwbnXpgZ7u71Efatue99o"
const gptData = await selectUserData(UserDataType.GPT)
const threadID = gptData?.threadID
const userDataFileID = gptData?.fileID
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
    const messages = await openai.beta.threads.messages.list(
        threadID, {
            limit: 10
        }
      );
    console.log(JSON.stringify(messages))
    return messages
}
export const sendProfile = async () => {
    const profile = await selectUserData(UserDataType.Profile)
    console.log(profile)
    const prompt = `Updated user's profile: """${JSON.stringify(profile)}"""`
    const message = await openai.beta.threads.messages.create(
        threadID,
        {
            role: "user",
            content: prompt
        }
    );
}
export const sendAIDataBulk = async (startDate: Date, endDate: Date) => {
    const activityData = await queryHealthData(toShortISODate(startDate), toShortISODate(endDate), HealthDataType.Activity, Provider.Unified)
    const sleepData = await queryHealthData(toShortISODate(startDate), toShortISODate(endDate), HealthDataType.Sleep, Provider.Unified)
    await openai.beta.threads.messages.create(threadID, {
        role: "user",
        content: `Update for Activity data: """${JSON.stringify(activityData)}"""`
    })
    await openai.beta.threads.messages.create(threadID, {
        role: "user",
        content: `Update for Sleep data: """${JSON.stringify(sleepData)}"""`
    })
}
export const sendAIData = async (date: Date) => {
    const activityData = await selectHealthData(toShortISODate(date), HealthDataType.Activity, Provider.Unified, true)
    const sleepData = await selectHealthData(toShortISODate(date), HealthDataType.Sleep, Provider.Unified, true)
    await openai.beta.threads.messages.create(threadID, {
        role: "user",
        content: `Update for Activity data: """${JSON.stringify(activityData)}"""`
    })
    await openai.beta.threads.messages.create(threadID, {
        role: "user",
        content: `Update for Sleep data: """${JSON.stringify(sleepData)}"""`
    })
}

export const executePrompt = async (prompt: string) => {
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
    // // poll the run for completion
    // while (waitStatuses.includes(run.status)){
    //     await sleep(getRandomInt(800, 1600))
    //     run = await openai.beta.threads.runs.retrieve(
    //         threadID,
    //         run.id
    //       );
    // }
}

export const createActivityPlan = async (curDate: Date) => {
    const monday = getMonday(curDate)
    const data = await queryHealthData(toShortISODate(monday), toShortISODate(curDate), HealthDataType.Activity, Provider.Unified)
    const prompt = `using this week's activity data, create physical activity plan for ${toShortISODate(curDate)}
activity data: """${JSON.stringify(data)}""". just provide activities and their description. Make sure the plan provides balanced activity for the week
make sure that the plan provides enough activity to hit my MET weekly target as per profile`
    await executePrompt(prompt)
    
}

export const getDaysFeedback = async (date: Date) => {
    const prompt = ``
    await executePrompt(prompt)
    const messages = await getThreadMessages()
    const feedback = messages.data[0].content[0]
    return feedback
}

export const saveMonthsData = async () => {
    // get data
    
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
    await openai.files.del(userDataFileID)
    const file = await openai.files.create({
        file: createReadStream(filename),
        purpose: "assistants"
    })
    
    await insertUserData({
        fileID: file.id,
        threadID: threadID
    }, UserDataType.GPT)
}
await executePrompt(`Dont use prior context. Please use userData.json file. Use the profile to tailor your response. Create physical activity plan for a single day: 2024-02-19. First calculate the day of the week, then start to create the plan. Only use data in date range: 2024-02-12 to 2024-02-19. Make sure to include weight-lifting exercises on gym going days, otherwise recommend outdoor or home no-equipment activities. Include MET minutes estimate for each activity`)
