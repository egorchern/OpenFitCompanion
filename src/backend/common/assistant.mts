import OpenAI from "openai";
const openai = new OpenAI()
const assistantID = "asst_25NkwbnXpgZ7u71Efatue99o"
const assistant = await openai.beta.assistants.retrieve(assistantID)
const threadID = "thread_0NPXb7NvhKgFXsObDGaNQflW"
// const message = await openai.beta.threads.messages.create(
//   threadID,
//   {
//     role: "user"
//   }
// )
