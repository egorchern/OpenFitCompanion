import OpenAI from "openai";
import { selectUserData } from "./db/userData/select.mjs";
import { UserDataType } from "./db/userData/types.mjs";
import { getMonday, getRandomInt, sleep, toShortISODate } from "./utilities.mjs";
import { queryHealthData } from "./db/healtData/query.mjs";
import { HealthDataType } from "./db/healtData/types.mjs";
import { Provider } from "./types.mjs";
const openai = new OpenAI()
const assistantID = "asst_25NkwbnXpgZ7u71Efatue99o"
const threadID = "thread_P2WBj3hsBtH7LdpMfoIb1i1c"

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
        threadID
      );
    console.log(JSON.stringify(messages))
    return messages
}
export const sendProfile = async () => {
    const profile = await selectUserData(UserDataType.Profile)
    console.log(profile)
    const prompt = `user's profile: """${JSON.stringify(profile)}"""`
    const message = await openai.beta.threads.messages.create(
        threadID,
        {
            role: "user",
            content: prompt
        }
    );
}
export const createActivityPlan = async (curDate: Date) => {
    const monday = getMonday(curDate)
    const data = await queryHealthData(toShortISODate(monday), toShortISODate(curDate), HealthDataType.Activity, Provider.Unified)
    const prompt = `using this week's activity data, create physical activity plan for ${toShortISODate(curDate)}
activity data: """${JSON.stringify(data)}""". just provide activities and their description. Make sure the plan provides balanced activity for the week
make sure that the plan provides enough activity to hit my MET weekly target as per profile`
    const message = await openai.beta.threads.messages.create(
        threadID,
        {
            role: "user",
            content: prompt
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
    while (waitStatuses.includes(run.status)){
        await sleep(getRandomInt(800, 1600))
        run = await openai.beta.threads.runs.retrieve(
            threadID,
            run.id
          );
    }
    
}
// const thread = await openai.beta.threads.create(

// )
// console.log(thread)
// await sendProfile()
// await createActivityPlan(new Date("2024-02-14"))
await getThreadMessages()