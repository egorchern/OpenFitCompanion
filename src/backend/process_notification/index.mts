import { HealthDataType } from "../common/db/healtData/types.mjs";
import { insertHealthData } from "../common/db/healtData/insert.mjs";
import { Provider } from "../common/types.mjs";
import { getAdapter } from "../common/adapter.mjs";
import { unify } from "../common/data.mjs";


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
    await insertHealthData(data);
    await unify(data.date, data.type)
}

await processNotification({"provider":"Oura","date":"2024-01-14T13:38:20.123000+00:00","data_type":"daily_activity"})
// await processNotification({"provider":"Withings","userid":"36671686","appli":"16","date":"2024-01-14"})