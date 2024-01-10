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
    const obj = JSON.parse(record.Sns.Message);
    console.log(`Processing: ${obj}`);
    await processNotification(obj)
  }
};


const processNotification = async (obj: any) => {
    const provider = obj.provider as Provider
    const adapter = getAdapter(provider);
    const data = await adapter.processNotification(obj);
    const todayDate = new Date().toISOString().slice(0, 10)
    const type = obj.type as HealthDataType;
    await insertHealthData(todayDate, type, data);
}