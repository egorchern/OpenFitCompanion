import { HealthDataType } from "../common/db/healtData/types.mjs";
import { insertHealthData } from "../common/db/healtData/insert.mjs";
import { Provider } from "common/types.mjs";
import { getAdapter } from "common/adapter.mjs";


export const handler = async (
  event: any,
  context: any
) => {
  for (const record of event.Records) {
    // const message: string = JSON.stringify(record.Sns.Message).replaceAll("\"", "");
    const message = record.Sns.Message
    const obj = JSON.parse(message);
    console.log(`Processing: ${message}`);
    await processNotification(obj)
  }
};


const processNotification = async (obj: any) => {
    const provider = obj.provider as Provider
    const adapter = getAdapter(provider);
    const data = await adapter.processNotification(obj);
    const todayDate = new Date().toISOString().slice(0, 10)
    await insertHealthData(todayDate, data);
}